import { ModelTypes } from '../zeus/index.js';

export type PathModel = Omit<ModelTypes['Path'], 'university'> & {
  university: string;
};
