import { iGraphQL } from 'i-graphql';
import { ObjectId } from 'mongodb';
import { Models } from '../../models/index.js';
import { Collections } from './collections.js';

export const orm = async () => {
  return iGraphQL<
    {
      Universities: Models['UniversityModel'];
      Paths: Models['PathModel'];
      Conversations: Models['ConversationModel'];
      Jobs: Models['JobModel'];
    },
    {
      _id: () => string;
      createdAt: () => string;
    }
  >(
    {
      _id: () => new ObjectId().toHexString(),
      createdAt: () => new Date().toISOString(),
    },
    async (db) => {},
  );
};

export const MongOrb = await orm();

export const mustFindOne = async (col: Collections, filter: {}, options: {} | null = null) => {
  return orm().then((o) =>
    o(col)
      .collection.findOne(filter, options ? options : {})
      .catch(() => {
        throw new Error('mustFindOne returns null');
      }),
  );
};

export const mustFindAny = async (col: Collections, filter: {} | null = null, options: {} | null = null) => {
  return await orm().then((o) =>
    o(col)
      .collection.find(filter ? filter : {}, options ? options : {})
      .toArray()
      .catch(() => {
        throw new Error('mustFindOne returns null');
      }),
  );
};

export type PageOptions = {
  limit: number;
  page: number;
  skip: number;
};

export const preparePageOptions = (page?: { limit?: number | null; page?: number | null } | null): PageOptions => {
  const lim = page?.limit || 10;
  const sk = page?.page || 0;
  return {
    limit: lim,
    page: sk,
    skip: lim * sk,
  };
};
