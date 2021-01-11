"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeacherObject = exports.setSubject = exports.setSex = exports.getTime = exports.getDayOfWeek = void 0;
const models_1 = require("./models/models");
const getDayOfWeek = (date) => {
    return new Date(date).getDay() + 1;
};
exports.getDayOfWeek = getDayOfWeek;
const getTime = (date) => {
    const dateValue = new Date(date);
    const hours = formatValue(dateValue.getHours());
    const minutes = formatValue(dateValue.getMinutes());
    const seconds = formatValue(dateValue.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
};
exports.getTime = getTime;
const setSex = (value) => {
    if (value === models_1.Sex.male) {
        return models_1.Sex.male;
    }
    if (value === models_1.Sex.female) {
        return models_1.Sex.female;
    }
    return models_1.Sex.other;
};
exports.setSex = setSex;
const setSubject = (value) => {
    if (value === models_1.Subject.Biology) {
        return models_1.Subject.Biology;
    }
    if (value === models_1.Subject.Math) {
        return models_1.Subject.Math;
    }
    if (value === models_1.Subject.Physics) {
        return models_1.Subject.Physics;
    }
    if (value === models_1.Subject.Chemistry) {
        return models_1.Subject.Chemistry;
    }
    return models_1.Subject.Empty;
};
exports.setSubject = setSubject;
const createTeacherObject = (element) => {
    return {
        staffNumber: parseInt(element[0]),
        name: element[1],
        sex: exports.setSex(element[2]),
        age: parseInt(element[3]),
        yearsOfExperience: parseInt(element[4]),
        specialization: exports.setSubject(element[5]),
    };
};
exports.createTeacherObject = createTeacherObject;
function formatValue(value) {
    return value > 10 ? value : '0' + value;
}
