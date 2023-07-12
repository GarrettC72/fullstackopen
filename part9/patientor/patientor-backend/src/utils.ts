import { Entry, EntryType, Gender, NewPatient } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const isEntry = (param: object): param is Entry => {
  return 'type' in param && isString(param.type) &&
  Object.values(EntryType).map(v => v.toString()).includes(param.type);
};

const isEntries = (param: unknown[]): param is Entry[] => {
  return param.every(parseEntry);
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }

  return ssn;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error('Incorrect dateOfBirth: ' + dateOfBirth);
  }

  return dateOfBirth;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect gender: ' + gender);
  }

  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }

  return occupation;
};

const parseEntry = (entry: unknown): Entry => {
  if (!entry || typeof entry !== 'object' || !isEntry(entry)) {
    throw new Error('Incorrect or missing entry');
  }

  return entry;
};

export const parseEntries = (entries: unknown[]): Entry[] => {
  if (!entries || !isEntries(entries)) {
    throw new Error('Incorrect or missing entries');
  }

  return entries;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'ssn' in object && 'dateOfBirth' in object &&
  'gender' in object && 'occupation' in object) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      ssn: parseSsn(object.ssn),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: []
    };

    return newPatient;
  }

  throw new Error('Incorrect data: some fields are missing');
};

// export default toNewPatient;