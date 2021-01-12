import { DBitem, Sex, Subject, Teacher } from "./models/models";

export const getDayOfWeek = (date: string): number => {
  return new Date(date).getDay() + 1;
}

export const getTime = (date: string): string => {
  const dateValue = new Date(date);
  const hours = formatValue(dateValue.getHours());
  const minutes = formatValue(dateValue.getMinutes());
  const seconds = formatValue(dateValue.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

export const setSex = (value: string): Sex => {
  if(value === Sex.male) {
    return Sex.male;
  }
  if (value === Sex.female) {
    return Sex.female;
  }
  return Sex.other;
}

export const setSubject = (value: string): Subject => {
  if (value === Subject.Biology) {
    return Subject.Biology;
  }
  if (value === Subject.Math) {
    return Subject.Math;
  }
  if (value === Subject.Physics) {
    return Subject.Physics;
  }
  if (value === Subject.Chemistry) {
    return Subject.Chemistry;
  }
  return Subject.Empty;
}

export const createTeacherObject = (element: DBitem): Teacher => {
    return {
      staffNumber: parseInt(element[0]), 
      name: element[1],
      sex: setSex(element[2]),
      age: parseInt(element[3]),
      yearsOfExperience: parseInt(element[4]),
      specialization: setSubject(element[5]),
    }
}

function formatValue(value: number): string | number {
  return value > 10 ? value : '0' + value;
}