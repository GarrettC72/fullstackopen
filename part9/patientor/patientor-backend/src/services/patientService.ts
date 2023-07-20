import { v1 as uuid } from 'uuid';

import patients from '../../data/patients';

import { Entry, NewEntry, NewPatient, NonSensitivePatient, Patient } from '../types';

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry): Entry | null => {
  const patient = patients.find(p => p.id === id);
  if (!patient) return null;
  const newEntry = {
    id: uuid(),
    ...entry
  };
  
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getNonSensitivePatients,
  findById,
  addPatient,
  addEntry
};