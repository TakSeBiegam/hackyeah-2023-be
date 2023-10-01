import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus/index.js';
import { orm } from '../utils/db/orm.js';
import { createFineTuneJob, createOpenaiFile } from '../utils/finetuning.js';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'useFineTuneJob', async (args) => {
    const o = await orm();
    const conversations = await o('Conversations').collection.find({}).toArray();
    const jobs = await o('Jobs').collection.countDocuments({
      conversationCountWhenCreated: { $gte: conversations.length + 1 },
    });
    if (conversations.length % 100 > 10 && conversations.length % 100 < 25 && jobs === 0) {
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
        files: createFineTune.files,
        conversationCountWhenCreated: conversations.length,
        fineTuneModel: createFineTune.fineTuneModel,
      });
      return true;
    }
    return false;
  })(input.arguments);
