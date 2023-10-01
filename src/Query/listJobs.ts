import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus/index.js';
import { orm } from '../utils/db/orm.js';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', 'listJobs', async (args) => {
    const jobs = await orm().then((o) => o('Jobs').collection.find({}).sort({ createdAt: 'desc' }).toArray());
    return jobs.map((job) => ({
      _id: job._id,
      file: job.file,
      createdAt: job.createdAt,
      tuneId: job.tuneId,
      conversationCountWhenCreated: job.conversationCountWhenCreated,
    }));
  })(input.arguments);
