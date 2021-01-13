"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const db_1 = require("./db");
const models_1 = require("./models/models");
const utils_1 = require("./utils");
const app = express_1.default();
app.use(express_1.default.json());
app.listen(config_1.default.PORT, () => {
    console.log(`Listening on : ${config_1.default.PORT}`);
});
process.on('SIGINT', () => {
    console.log('\nCtrl - C pressed\n');
    db_1.closeClient();
    process.exit();
});
app.get('/teachers', (req, res) => {
    db_1.getAllTeachers()
        .then(result => {
        const teachers = [];
        result.forEach(element => {
            teachers.push(utils_1.createTeacherObject(element));
        });
        console.log(teachers);
        res.send({ result: teachers });
    });
});
app.put('/teachers', (req, res, next) => {
    const { staffNumber, name, sex, age, yearsOfExperience, specialization } = req.query;
    if (!name && !sex && !age && !yearsOfExperience && !specialization) {
        res.send({ error: 'error' });
        return;
    }
    const newTeacher = {
        staffNumber: 0,
        name: typeof name === 'string' ? name : 'no name',
        sex: models_1.Sex.male,
        age: 18,
        yearsOfExperience: 0,
        specialization: models_1.Subject.Empty
    };
    if (typeof staffNumber === 'string') {
        newTeacher.staffNumber = parseInt(staffNumber);
    }
    if (typeof sex === 'string') {
        newTeacher.sex = utils_1.setSex(sex);
    }
    if (typeof specialization === 'string') {
        newTeacher.specialization = utils_1.setSubject(specialization);
    }
    if (typeof age === 'string') {
        newTeacher.age = parseInt(age);
    }
    if (typeof yearsOfExperience === 'string') {
        newTeacher.yearsOfExperience = parseInt(yearsOfExperience);
    }
    db_1.createEntityInDB(newTeacher)
        .then(result => {
        console.log(newTeacher);
        res.send({ result, newTeacher });
    })
        .catch(err => res.send({ error: err.message }));
});
app.get('/teachers/name/:name', (req, res) => {
    const name = req.params.name;
    if (typeof name === 'string') {
        db_1.getTeacherByName(name)
            .then(result => {
            if (result.length === 0) {
                res.send({ result });
                return;
            }
            const teachers = [];
            teachers.push(utils_1.createTeacherObject(result[0]));
            res.send({ result: teachers });
        })
            .catch(err => res.send({ error: err.message }));
    }
    else {
        res.send({ error: 'error' });
    }
});
app.get('/teachers/id/:id', (req, res) => {
    const id = req.params.id;
    if (typeof id === 'string') {
        db_1.getTeacherById(id)
            .then(result => {
            if (result.length === 0) {
                res.send({ result });
                return;
            }
            const teachers = [];
            teachers.push(utils_1.createTeacherObject(result[0]));
            res.send({ result: teachers });
        })
            .catch(err => {
            res.send({ error: err });
        });
    }
    else {
        res.send({ error: 'error' });
    }
});
app.get('/teachers/sex/:sex', (req, res) => {
    const sex = req.params.sex;
    if (sex && typeof sex === 'string') {
        db_1.getTeacherBySex(sex)
            .then(result => {
            if (result.length === 0) {
                res.send({ result });
                return;
            }
            const teachers = [];
            result.forEach(element => {
                teachers.push(utils_1.createTeacherObject(element));
            });
            console.log(teachers);
            res.send({ result: teachers });
        })
            .catch(err => res.send({ error: err }));
    }
    else {
        console.log('Wrong parameter');
        res.send({ error: 'Wrong parameter' });
    }
});
app.post('/teachers/experience/:id/:exp', (req, res, next) => {
    console.log(req.params);
    const { id, exp } = req.params;
    if (!id && !exp) {
        next();
    }
    db_1.updateExperienceInDB(parseInt(id), parseInt(exp))
        .then(() => db_1.getTeacherById(id).then(result => {
        if (result.length === 0) {
            res.send({ result });
            return;
        }
        const teachers = [];
        result.forEach((element) => {
            return teachers.push(utils_1.createTeacherObject(element));
        });
        console.log(teachers);
        res.send({ result: teachers });
    }))
        .catch(err => res.send({ error: err }));
});
app.delete('/teachers', (req, res) => {
    const id = req.query.staffNumber;
    if (!id || typeof id !== 'string') {
        res.send({ error: "Wrong staff number." });
        return;
    }
    db_1.deleteFromDB(parseInt(id))
        .then(result => res.send({ result }))
        .catch(err => res.send({ error: err }));
});
app.get('/teachers/subject/:sub', (req, res) => {
    const sub = req.params.sub;
    if (sub && typeof sub === 'string') {
        db_1.getTeacherBySubject(sub)
            .then(result => {
            if (result.length === 0) {
                res.send({ result });
                return;
            }
            const teachers = [];
            result.forEach((element) => {
                return teachers.push(utils_1.createTeacherObject(element));
            });
            console.log(teachers);
            res.send({ result: teachers });
        })
            .catch(err => res.send({ error: err }));
    }
    else {
        res.send({ error: 'error' });
    }
});
app.get('/teachers/target', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teachers = [];
    try {
        const teachersResultArray = yield db_1.getTargetMathTeachers(100, 5, 10, models_1.Subject.Math, '08:30:00', '14:30:00');
        if (teachersResultArray.length === 0) {
            res.send({ result: teachersResultArray });
            return;
        }
        yield teachersResultArray.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
            const teacher = utils_1.createTeacherObject(element);
            teachers.push(teacher);
        }));
        console.log(teachers);
        res.send({ result: teachers });
    }
    catch (err) {
        console.log(err);
        res.send({ error: err });
    }
}));
