import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus/index.js';
import { orm } from '../utils/db/orm.js';
import OpenAI from 'openai';

export type JobResponseObject = {
  error?: ErrorMessage | null;
  id?: string;
  status?: string;
  organization_id?: string;
  model?: string;
  fine_tuned_model?: string;
  hyperparameters?: Hyper | null;
};
type Hyper = {
  n_epochs: number;
};
type ErrorMessage = {
  message: string | undefined;
};

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'useFineTuneJob', async (args) => {
    const o = await orm();
    const conversations = await o('Conversations').collection.find({}).toArray();
    if (conversations.length < 1) {
      return false;
    }
    const isolatedConversations = conversations.map((conversation) => conversation.payload);
    const transformedObject = isolatedConversations.map((context) => ({
      messages: context.map((item) => ({
        role: item.role,
        content: item.content,
      })),
    }));

    const dataset = JSON.stringify(transformedObject);
    console.log(dataset);
    const url = 'https://api.openai.com/v1/files';
    const headers = {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };
    const formData = new FormData();
    formData.append('purpose', 'fine-tune');
    formData.append('file', new Blob([dataset], { type: 'text/plain' }));
    const options = {
      method: 'POST',
      headers: headers,
      body: formData,
    };

    try {
      console.log('make response');
      const response = await fetch(url, options);
      console.log('done');
      return true;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  })(input.arguments);
