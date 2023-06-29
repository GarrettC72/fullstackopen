import diagnoeses from '../../data/diagnoses';

import { Diagnose } from '../types';

const getDiagnoeses = (): Diagnose[] => {
  return diagnoeses;
};

export default {
  getDiagnoeses
};