import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus/index.js';
import { orm } from '../utils/db/orm.js';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', "getUniByTags", async (args) => {
    const o = await orm();
    const unies = await o("Paths").collection.aggregate([
        {
          $match: {
            'tags': {
              $in: args.tags,
            },
          },
        },
        {
          $addFields: {
            matchingTags: {
              $size: {
                $setIntersection: ['$tags', args.tags],
              },
            },
          },
        },
        {
          $sort: {
            matchingTags: -1,
          },
        },
      ])
      .limit(5)
      .toArray();
    return unies;

  })(input.arguments);
