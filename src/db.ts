import mysqlx from '@mysql/xdevapi';

import config from './config';
import { INSERT_TEACHER, SELECT_ALL, SELECT_TARGET_TEACHERS_IDS, SELECT_WHERE, USE_TABLE } from './const';
import { DBitem, Sex, Subject, Teacher } from './models/models';
const dbClient = mysqlx.getClient(
  {
    host: config.HOST,
    port: config.DB_PORT,
    user: config.USER,
    password: config.PASS
  },
  {
    pooling: {
      enabled: true,
      maxIdleTime: 30000,
      maxSize: 25,
      queueTimeout: 10000
    }
  }
);

const closeClient = (): void => {
  dbClient.close();
  console.log('Clossing connection...\n');
};

const closeConnection = (connection: any): void => {
  connection.close();
  console.log('Releasing connection to pool...');
};

// Create new Teacher record in teachers table
export const createEntityInDB = async (
  teacher: Teacher
): Promise<unknown> => {
  const connection = await dbClient.getSession();
  try {
      await connection.sql(USE_TABLE).execute();
      const result = await connection
    .sql(INSERT_TEACHER)
    .bind(teacher.staffNumber)
    .bind(teacher.name)
    .bind(Sex[teacher.sex])
    .bind(teacher.yearsOfExperience)
    .bind(teacher.age)
    .bind(Subject[teacher.specialization])
    .execute();
    return result.getAffectedItemsCount();
  }catch (e) {
    console.log(e);
    throw e;
  } finally {
    closeConnection(connection);
  }
};

// Helper function get generic teacher
const getTeacher = async (param: string, value: string): Promise<DBitem[]> => {
  const connection = await dbClient.getSession();
  try {
    await connection.sql(USE_TABLE).execute();
    const result = await connection
        .sql(SELECT_WHERE(param))
        .bind(value)
        .execute();
    return result.fetchAll();
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    closeConnection(connection);
  }
}


// Get teacher by name
export const getTeacherByName = async (name: string): Promise<DBitem[]> => {
  return getTeacher('name', name);
}
// Get teacher by id
export const getTeacherById = async (id: string): Promise<DBitem[]> => {
  return getTeacher('staff_number', id);
}
// Get teacher by sex
export const getTeacherBySex = async (num: string): Promise<DBitem[]> => {
  return getTeacher('sex', num);
}
// Get teacher by subject
export const getTeacherBySubject = async (num: string): Promise<DBitem[]> => {
  return getTeacher('specialization', num);
}

// Update experience 
export const updateExperienceInDB = async (staffNumber: number, experience: number): Promise<any> => {
  const connection = await dbClient.getSession();
  try {
    await connection.sql(USE_TABLE).execute();
    const shema = await connection.getSchema('test_task_db');
    const table = await shema.getTable('teachers');
    const result = await table.update().where(`staff_number = :number`).set('years_of_experience', experience)
    .bind('number', staffNumber)
    .execute();
    return result.getAffectedItemsCount();
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    closeConnection(connection);
  }
};

// Delete teacher record by id
export const deleteFromDB = async (staffNumber: number): Promise<unknown> => {
  const connection = await dbClient.getSession();
  try {
    await connection.sql(USE_TABLE).execute();
    const shema = await connection.getSchema('test_task_db');
    const table = await shema.getTable('teachers');
    const result = await table.delete().where(`staff_number = :number`)
    .bind('number', staffNumber)
    .execute();
    return result.getAffectedItemsCount();
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    closeConnection(connection);
  }
};

// Get all teachers
export const getAllTeachers = async (): Promise<DBitem[]> => {
  const connection = await dbClient.getSession();
  try {
    await connection.sql(USE_TABLE).execute();
    const result = await connection
        .sql(SELECT_ALL)
        .execute();
    return result.fetchAll();
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    closeConnection(connection);
  }

};

// Get target teachers with prepared statement
export const getTargetMathTeachers = async (
  classRoom: number,
  dayOfWeek: number,
  yearsOfExperience: number,
  specialization: Subject,
  timeStart: string,
  timeEnd: string
  ): Promise<DBitem[]> => {
  const connection = await dbClient.getSession();
  try {
    await connection.sql(USE_TABLE).execute();
    const result = await connection
        .sql(SELECT_TARGET_TEACHERS_IDS)
        .bind(classRoom)
        .bind(dayOfWeek)
        .bind(yearsOfExperience)
        .bind(specialization)
        .bind(timeStart)
        .bind(timeEnd)
        .execute();
    return result.fetchAll();
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    closeConnection(connection);
  }
};

export {closeClient };