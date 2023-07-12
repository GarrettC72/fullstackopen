import diagnoeses from '../../data/diagnoses';

import { Diagnosis } from '../types';

const getDiagnoeses = (): Diagnosis[] => {
  return diagnoeses;
};

export default {
  getDiagnoeses
};