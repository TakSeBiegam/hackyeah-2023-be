import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus/index.js';
import { orm } from '../utils/db/orm.js';
import OpenAI, { toFile } from 'openai';
import fs from 'fs';
import { createFineTuneJob, createOpenaiFile } from '../utils/finetuning.js';
import { send } from 'process';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'useFineTuneJob', async (args) => {
    const o = await orm();
    const conversations = await o('Conversations').collection.find({}).toArray();
    const jobs = await o('Jobs').collection.countDocuments({
      conversationCountWhenCreated: { $gte: conversations.length + 1 },
    });
    if (conversations.length % 1000 > 100 && conversations.length % 1000 < 125 && jobs === 0) {
      let datasets = '';
      const isolatedConversations = conversations.map((conversation) => conversation.payload);
      isolatedConversations.forEach((context) => {
        const content = context.map((item) => ({
          role: item.role,
          content: item.content,
        }));
        datasets += `${JSON.stringify({ messages: content })}\n`;
      });

      const sendFile = await createOpenaiFile(datasets);
      const createFineTune = await createFineTuneJob(sendFile.id);
      await o('Jobs').createWithAutoFields(
        '_id',
        'createdAt',
      )({
        tuneId: createFineTune._id,
        file: createFineTune.file,
        conversationCountWhenCreated: conversations.length,
      });
      return true;
    }
    return false;
  })(input.arguments);
