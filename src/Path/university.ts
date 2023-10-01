import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus/index.js';
import { orm } from '../utils/db/orm.js';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Path', 'university', async (args, src) => {
    const o = await orm();
    return await o('Universities').collection.findOne({ _id: src.university });
  })(input.arguments, input.source);
