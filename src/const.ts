import { Subject } from './models/models';

export const USE_TABLE = 'USE test_task_db';
export const SELECT_ALL =
  'SELECT staff_number, name, sex, age, years_of_experience, specialization FROM teachers';
export const INSERT_TEACHER =
  'INSERT INTO teachers (staff_number, name, sex, years_of_experience, age, specialization) ' +
  'VALUES(?, ?, ?, ?, ?, ?)';
export const SELECT_TARGET_TEACHERS_IDS =
    // 'SELECT DISTINCT staff_number, name, sex, age, years_of_experience, specialization FROM (' +
    // 'SELECT * FROM teachers ' +
    // 'JOIN lessons ' +
    // 'ON lessons.teachers_staff_number = teachers.staff_number) as joined ' +
    // 'WHERE classrooms_number = ? ' +
    // 'AND DAYOFWEEK(`date`) = ? ' +
    // 'AND years_of_experience >= ? ' +
    // "AND specialization = ? " +
    // "AND time_start >= ? " +
    // "AND time_end <= ?";
    'SELECT DISTINCT staff_number, name, sex, age, years_of_experience, specialization FROM (' +
      'SELECT * FROM teachers ' +
      'JOIN lessons ' +
      'ON lessons.teachers_staff_number = teachers.staff_number) as joined ' +
      'WHERE classrooms_number = ? AND DAYOFWEEK(`date`) = ? ' +
      'AND years_of_experience >= ? ' +
      "AND specialization = ? " +
      "AND time_start >= ? AND time_end <= ?";
export const SELECT_WHERE = (param: string): string => SELECT_ALL + ' WHERE ' + param + ' = ?';
