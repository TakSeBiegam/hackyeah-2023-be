import OpenAI, { toFile } from 'openai';
import { Models } from '../models';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

const headers = {
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
};

const url = 'https://api.openai.com/v1/files';

export const createOpenaiFile = async (datasets: string) => {
  const t = await openai.files.create({
    file: await toFile(Buffer.from(datasets, 'utf8')),
    purpose: 'fine-tune',
  });
  return {
    file: t.filename,
    id: t.id,
    createdAt: t.created_at,
  };
};

export const createFineTuneJob = async (file: string): Promise<Models['JobModel']> => {
  const fineTuningJob = await openai.fineTuning.jobs.create({
    training_file: 'file-q0tEsD4Smmiu2BcZJfa9t0dC',
    model: 'gpt-3.5-turbo',
  });
  return {
    _id: 'UNKNOWN',
    createdAt: new Date().toISOString(),
    files: fineTuningJob.result_files,
    tuneId: fineTuningJob.id,
    conversationCountWhenCreated: 0,
    fineTuneModel: fineTuningJob.fine_tuned_model || undefined,
  };
};
