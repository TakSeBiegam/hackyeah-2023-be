import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus/index.js';
import { orm } from '../utils/db/orm.js';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'testEndpoint', async (args) => {
    console.log('tak');
    const o = await orm();
    const paths = await o('Paths').collection.find({}).toArray();
    await Promise.all(
      paths.map(async (element) => {
        o('Paths').collection.updateOne(
          { _id: element._id },
          {
            $set: {
              university: '65185ee61b8a987e55d0549b',
            },
          },
        );
      }),
    );
    return 'tak';
  })(input.arguments);
