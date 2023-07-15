import { Diagnosis, Discharge, Gender, HealthCheckRating, NewEntry, NewPatient, SickLeave } from "./types";

const isNumber = (number: unknown): number is number => {
  return typeof number === 'number' || number instanceof Number;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).map(v => Number(v)).includes(param);
};

const parseStringParam = (param: unknown, field: string): string => {
  if (!isString(param)) {
    throw new Error(`Incorrect or missing ${field}`);
  }

  return param;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect dateOfBirth: ' + date);
  }

  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect gender: ' + gender);
  }

  return gender;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
  if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
    throw new Error('Incorrect healthCheckRating: ' + healthCheckRating);
  }

  return healthCheckRating;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || typeof discharge !== 'object' || !('date' in discharge)
  || !('criteria' in discharge)) {
    throw new Error('Incorrect or missing discharge');
  }

  return {
    date: parseDate(discharge.date),
    criteria: parseStringParam(discharge.criteria, 'criteria')
  };
};

const parseSickLeave = (object: unknown): SickLeave | undefined => {
  if (!object || typeof object !== 'object' || !('sickLeave' in object)) {
    // we will just trust the data to be in correct form
    return undefined;
  }

  if (!object.sickLeave || typeof object.sickLeave !== 'object' ||
  !('startDate' in object.sickLeave) ||
  !('endDate' in object.sickLeave)) {
    throw new Error('Incorrect or missing fields in discharge');
  }

  return {
    startDate: parseDate(object.sickLeave.startDate),
    endDate: parseDate(object.sickLeave.endDate)
  };
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'ssn' in object && 'dateOfBirth' in object &&
  'gender' in object && 'occupation' in object) {
    const newPatient: NewPatient = {
      name: parseStringParam(object.name, 'name'),
      ssn: parseStringParam(object.ssn, 'ssn'),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseStringParam(object.occupation, 'occupation'),
      entries: []
    };

    return newPatient;
  }

  throw new Error('Incorrect data: some fields are missing');
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (!('description' in object) || !('date' in object)
  || !('specialist' in object) || !('type' in object)) {
    throw new Error('Incorrect data: some fields are missing');
  }

  let newEntry: NewEntry;

  switch (object.type) {
    case 'Hospital':
      if (!('discharge' in object)) {
        throw new Error('Incorrect data: some fields are missing');
      }
      newEntry = {
        description: parseStringParam(object.description, 'description'),
        date: parseDate(object.date),
        specialist: parseStringParam(object.specialist, 'specialist'),
        diagnosisCodes: parseDiagnosisCodes(object),
        type: 'Hospital',
        discharge: parseDischarge(object.discharge)
      };
      break;
    case 'OccupationalHealthcare':
      if (!('employerName' in object)) {
        throw new Error('Incorrect data: some fields are missing');
      }
      newEntry = {
        description: parseStringParam(object.description, 'description'),
        date: parseDate(object.date),
        specialist: parseStringParam(object.specialist, 'specialist'),
        diagnosisCodes: parseDiagnosisCodes(object),
        type: 'OccupationalHealthcare',
        employerName: parseStringParam(object.employerName, 'employerName'),
        sickLeave: parseSickLeave(object)
      };
      break;
    case 'HealthCheck':
      if (!('healthCheckRating' in object)) {
        throw new Error('Incorrect data: some fields are missing');
      }
      newEntry = {
        description: parseStringParam(object.description, 'description'),
        date: parseDate(object.date),
        specialist: parseStringParam(object.specialist, 'specialist'),
        diagnosisCodes: parseDiagnosisCodes(object),
        type: 'HealthCheck',
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
      };
      break;
    default:
      throw new Error('Incorrect type: ' + object.type);
  }

  return newEntry;
};