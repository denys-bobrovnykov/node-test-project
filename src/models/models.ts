export interface Teacher {
  staffNumber: number
  readonly name: string;
  sex: Sex;
  age: number;
  yearsOfExperience: number;
  specialization: Subject 
}

export interface Classroom {
  readonly number: number;
  seatsAvailable: number;
}

export interface Lesson {
  classroom: Classroom
  day: Date
  timeStart: Date;
  timeEnd: Date;
  teacher: Teacher;
  subject: Subject;
}

export enum Subject {
  Biology = 'Biology',
  Math = 'Math', 
  Physics = 'Physics', 
  Chemistry = 'Chemistry',
  Empty = 'Empty'
}


export enum Sex {
  male = 'male',
  female = 'female',
  other = 'other',
}

export type DBitem = [id: string, name: string, sex: string, age: string, experience: string, subject: string];