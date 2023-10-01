import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus/index.js';
import { orm } from '../utils/db/orm.js';
import { createTags } from '../utils/fastTools.js';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'testEndpoint', async (args) => {
    await createTags();
    return true;
  })(input.arguments);
