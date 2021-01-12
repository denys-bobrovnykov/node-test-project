"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeClient = exports.getTargetMathTeachers = exports.getAllTeachers = exports.deleteFromDB = exports.updateExperienceInDB = exports.getTeacherBySubject = exports.getTeacherBySex = exports.getTeacherById = exports.getTeacherByName = exports.createEntityInDB = void 0;
const xdevapi_1 = __importDefault(require("@mysql/xdevapi"));
const config_1 = __importDefault(require("./config"));
const const_1 = require("./const");
const models_1 = require("./models/models");
const dbClient = xdevapi_1.default.getClient({
    host: config_1.default.HOST,
    port: config_1.default.DB_PORT,
    user: config_1.default.USER,
    password: config_1.default.PASS
}, {
    pooling: {
        enabled: true,
        maxIdleTime: 30000,
        maxSize: 25,
        queueTimeout: 10000
    }
});
const closeClient = () => {
    dbClient.close();
    console.log('Clossing connection...\n');
};
exports.closeClient = closeClient;
const closeConnection = (connection) => {
    connection.close();
    console.log('Releasing connection to pool...');
};
// Create new Teacher record in teachers table
const createEntityInDB = (teacher) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbClient.getSession();
    try {
        yield connection.sql(const_1.USE_TABLE).execute();
        const result = yield connection
            .sql(const_1.INSERT_TEACHER)
            .bind(teacher.staffNumber)
            .bind(teacher.name)
            .bind(models_1.Sex[teacher.sex])
            .bind(teacher.yearsOfExperience)
            .bind(teacher.age)
            .bind(models_1.Subject[teacher.specialization])
            .execute();
        return result.getAffectedItemsCount();
    }
    catch (e) {
        console.log(e);
        throw e;
    }
    finally {
        closeConnection(connection);
    }
});
exports.createEntityInDB = createEntityInDB;
// Helper function get generic teacher
const getTeacher = (param, value) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbClient.getSession();
    try {
        yield connection.sql(const_1.USE_TABLE).execute();
        const result = yield connection
            .sql(const_1.SELECT_WHERE(param))
            .bind(value)
            .execute();
        return result.fetchAll();
    }
    catch (e) {
        console.log(e);
        throw e;
    }
    finally {
        closeConnection(connection);
    }
});
// Get teacher by name
const getTeacherByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return getTeacher('name', name);
});
exports.getTeacherByName = getTeacherByName;
// Get teacher by id
const getTeacherById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return getTeacher('staff_number', id);
});
exports.getTeacherById = getTeacherById;
// Get teacher by sex
const getTeacherBySex = (num) => __awaiter(void 0, void 0, void 0, function* () {
    return getTeacher('sex', num);
});
exports.getTeacherBySex = getTeacherBySex;
// Get teacher by subject
const getTeacherBySubject = (num) => __awaiter(void 0, void 0, void 0, function* () {
    return getTeacher('specialization', num);
});
exports.getTeacherBySubject = getTeacherBySubject;
// Update experience 
const updateExperienceInDB = (staffNumber, experience) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbClient.getSession();
    try {
        yield connection.sql(const_1.USE_TABLE).execute();
        const shema = yield connection.getSchema('test_task_db');
        const table = yield shema.getTable('teachers');
        const result = yield table.update().where(`staff_number = :number`).set('years_of_experience', experience)
            .bind('number', staffNumber)
            .execute();
        return result.getAffectedItemsCount();
    }
    catch (e) {
        console.log(e);
        throw e;
    }
    finally {
        closeConnection(connection);
    }
});
exports.updateExperienceInDB = updateExperienceInDB;
// Delete teacher record by id
const deleteFromDB = (staffNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbClient.getSession();
    try {
        yield connection.sql(const_1.USE_TABLE).execute();
        const shema = yield connection.getSchema('test_task_db');
        const table = yield shema.getTable('teachers');
        const result = yield table.delete().where(`staff_number = :number`)
            .bind('number', staffNumber)
            .execute();
        return result.getAffectedItemsCount();
    }
    catch (e) {
        console.log(e);
        throw e;
    }
    finally {
        closeConnection(connection);
    }
});
exports.deleteFromDB = deleteFromDB;
// Get all teachers
const getAllTeachers = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbClient.getSession();
    try {
        yield connection.sql(const_1.USE_TABLE).execute();
        const result = yield connection
            .sql(const_1.SELECT_ALL)
            .execute();
        return result.fetchAll();
    }
    catch (e) {
        console.log(e);
        throw e;
    }
    finally {
        closeConnection(connection);
    }
});
exports.getAllTeachers = getAllTeachers;
// Get target teachers with prepared statement
const getTargetMathTeachers = (classRoom, dayOfWeek, yearsOfExperience, specialization, timeStart, timeEnd) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbClient.getSession();
    try {
        yield connection.sql(const_1.USE_TABLE).execute();
        const result = yield connection
            .sql(const_1.SELECT_TARGET_TEACHERS_IDS)
            .bind(classRoom)
            .bind(dayOfWeek)
            .bind(yearsOfExperience)
            .bind(specialization)
            .bind(timeStart)
            .bind(timeEnd)
            .execute();
        return result.fetchAll();
    }
    catch (e) {
        console.log(e);
        throw e;
    }
    finally {
        closeConnection(connection);
    }
});
exports.getTargetMathTeachers = getTargetMathTeachers;
