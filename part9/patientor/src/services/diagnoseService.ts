import diagnoseData from '../../data/diagnoses.json';

import { DiagnoseEntry } from '../types';

const diagnoses: DiagnoseEntry[] = diagnoseData as DiagnoseEntry[];

const getDiagnoses = (): DiagnoseEntry[] => {
  return diagnoses;
};

const addDiagnose = () => {
  return null;
};

export default {
  getDiagnoses,
  addDiagnose
};