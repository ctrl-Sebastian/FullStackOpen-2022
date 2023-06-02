import { NewPatientEntry, Gender } from './types';

/**
 * Helper function for exhaustive type checking
 */
export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const isString = (text: any): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(param);
};

export const parseToString = (param: any, paramName: string): string => {
  if (!param || !isString(param)) {
    throw new Error(`Incorrect or missing ${paramName}: ${param || ""}`);
  }
  return param;
};

const parseGender = (gender: any) => {
  if (!gender || !isString(gender) || !isGender(gender.toLowerCase())) {
    throw new Error(`Incorrect or missing gender: ${gender || ""}`);
  }
  return gender.toLowerCase();
};

const parseDate = (date: unknown, paramName: string): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error(`Incorrect or missing ${paramName}: ${date || ""}`);  }
  return date;
};

const toNewPatientEntry = (object: any): NewPatientEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if('name' in object && 'occupation' in object && 'gender' in object && 'ssn' in object && 'dateOfBirth' in object){
    const newEntry: NewPatientEntry = {
      name: parseToString(object.name, "name"),
      occupation: parseToString(object.occupation, "occupation"),
      gender: parseGender(object.gender),
      ssn: parseToString(object.ssn, "social security number"),
      dateOfBirth: parseDate(object.dateOfBirth, "date of birth"),
    };

    return newEntry;
  }
  throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatientEntry;