import * as dotenv from 'dotenv';

dotenv.config();

import express from 'express';

import config from './config';

import { closeClient, getAllTeachers, createEntityInDB, getTeacherById, getTeacherByName, getTeacherBySex, getTeacherBySubject, getTargetMathTeachers, updateExperienceInDB, deleteFromDB } from './db';
import { DBitem, Sex, Subject, Teacher } from './models/models';
import { createTeacherObject, setSex, setSubject } from './utils';


const app = express();

app.use(express.json());

app.listen(config.PORT, () => {
  console.log(`Listening on : ${config.PORT}`);
});

process.on('SIGINT', () => {
  console.log('\nCtrl - C pressed\n')
  closeClient();
  process.exit();
});

app.get('/teachers', (req, res) => {
  getAllTeachers()
    .then(result => {
      const teachers: Teacher[] = [];
      result.forEach(element => {
        teachers.push(createTeacherObject(element));
      })
      console.log(teachers);
      res.send({result: teachers});
    });
})

app.post('/teachers', (req, res, next) => {
  const {staffNumber, name, sex, age, yearsOfExperience, specialization} = req.query;
  if (!name && !sex && !age && !yearsOfExperience && !specialization) {
    res.send({error: 'error'});
    next();
  }
  const newTeacher: Teacher = {
    staffNumber: 0,
    name: typeof name === 'string' ? name : 'no name',
    sex: Sex.male,
    age: 18,
    yearsOfExperience: 0,
    specialization: Subject.Empty
  };
  if (typeof staffNumber === 'string') {
    newTeacher.staffNumber = parseInt(staffNumber);
  }
  if (typeof sex === 'string') {
    newTeacher.sex = setSex(sex);
  }
  if (typeof specialization === 'string') {
    newTeacher.specialization = setSubject(specialization);
  }
  if (typeof age === 'string'){
      newTeacher.age = parseInt(age);
  }
  if (typeof yearsOfExperience === 'string') {
    newTeacher.yearsOfExperience = parseInt(yearsOfExperience);
  }
  createEntityInDB(newTeacher)
    .then(result => {
      console.log(newTeacher);
      res.send({result, newTeacher});
    })
    .catch(err => res.send({error: err.message}));
});

app.get('/teachers/name/:name', (req, res) => {
  const name = req.params.name;
  if (typeof name === 'string') {
    getTeacherByName(name)
    .then(result => {
      const teachers: Teacher[] = [];
      teachers.push(createTeacherObject(result[0]));
      res.send({result: teachers});
    })
    .catch(err => res.send({error: err}));
  } else {
    res.send({error: 'error'});
  }
})

app.get('/teachers/id/:id', (req, res) => {
  const id = req.params.id;
  if (typeof id === 'string') {
    getTeacherById(id)
      .then(result => {
        const teachers: Teacher[] = [];
        teachers.push(createTeacherObject(result[0]));
        res.send({result: teachers});
      })
      .catch(err => res.send({error: err}));
  } else {
    res.send({error: 'error'});
  }
})

app.get('/teachers/sex/:sex', (req, res) => {
  const sex = req.params.sex;
  if (sex && typeof sex === 'string') {
    getTeacherBySex(sex)
    .then(result => {
      const teachers: Teacher[] = [];
      result.forEach(element => {
        teachers.push(createTeacherObject(element));
      })
      console.log(teachers);
      res.send({result: teachers});
    })
      .catch(err => res.send({error: err}));
  } else {
    console.log('Wrong parameter');
    res.send({error: 'Wrong parameter'});
  }
})

app.put('/teachers/experience/:id/:exp', (req, res, next) => {
  console.log(req.params);
  const {id, exp} = req.params;
  if (!id && !exp) {
    next();
  }
  updateExperienceInDB(parseInt(id), parseInt(exp))
    .then(() => getTeacherById(id).then(result => {
      const teachers: Teacher[] = [];
      result.forEach((element) => {
        return teachers.push(createTeacherObject(element));
      })
      console.log(teachers);
      res.send({result: teachers});
    }))
    .catch(err => res.send({error: err}));
});

app.delete('/teachers', (req, res) => {
  const id = req.query.staffNumber;
  if (!id || typeof id !== 'string') {
    res.send({error: "Wrong staff number."});
    return;
  }
  deleteFromDB(parseInt(id))
    .then(result => res.send({result}))
    .catch(err => res.send({error: err}))
})

app.get('/teachers/subject/:sub', (req, res) => {
  const sub = req.params.sub;
  if (sub && typeof sub === 'string') {
    getTeacherBySubject(sub)
    .then(result => {
      const teachers: Teacher[] = [];
      result.forEach((element) => {
      return teachers.push(createTeacherObject(element));
      })
      console.log(teachers);
      res.send({result: teachers});
    })
      .catch(err => res.send({error: err}));
  } else {
    res.send({error: 'error'});
  }
})

app.get('/teachers/target', async (req, res) => {
  const teachers: Teacher[] = [];
  try {
    const teachersResultArray = await getTargetMathTeachers(100, 5, 10, Subject.Math, '08:30:00', '14:30:00');
    await teachersResultArray.forEach(async (element: DBitem) => {
      const teacher: Teacher = createTeacherObject(element);
      teachers.push(teacher);
    });
    console.log(teachers);
    res.send({result: teachers});
  } catch (err) {
    console.log(err)
    res.send({error: err});
  }
})


