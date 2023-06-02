import patientData from '../../data/patients';

import { v1 as uuid } from 'uuid'

import { NonSensitivePatientEntry, PatientEntry, NewPatientEntry } from '../types';

const patients: PatientEntry[] = patientData as PatientEntry[];

const getPatients = (): PatientEntry[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const findById = (id: string): PatientEntry | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const addPatient = ( entry: NewPatientEntry ): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getPatients,
  getNonSensitivePatients,
  addPatient,
  findById
};