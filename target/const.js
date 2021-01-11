"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELECT_WHERE = exports.SELECT_TARGET_TEACHERS_IDS = exports.INSERT_TEACHER = exports.SELECT_ALL = exports.USE_TABLE = void 0;
exports.USE_TABLE = 'USE test_task_db';
exports.SELECT_ALL = 'SELECT staff_number, name, sex, age, years_of_experience, specialization FROM teachers';
exports.INSERT_TEACHER = 'INSERT INTO teachers (staff_number, name, sex, years_of_experience, age, specialization) ' +
    'VALUES(?, ?, ?, ?, ?, ?)';
exports.SELECT_TARGET_TEACHERS_IDS = 
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
const SELECT_WHERE = (param) => exports.SELECT_ALL + ' WHERE ' + param + ' = ?';
exports.SELECT_WHERE = SELECT_WHERE;
