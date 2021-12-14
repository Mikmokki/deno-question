import { executeQuery } from "../database/database.js";

const addQuestion = async (userId, title, question_text) => {
  await executeQuery(
    `INSERT INTO questions
      (user_id, title, question_text)
        VALUES ($1, $2, $3);`,
    userId,
    title,
    question_text,
  );
};
const listAllQuestions = async () => {
  const res = await executeQuery(
    "SELECT * FROM questions;",
  );
  return res.rows;
};

const listQuestionsByUser = async (userId) => {
  const res = await executeQuery(
    "SELECT * FROM questions WHERE user_id=$1;",
    userId,
  );
  return res.rows;
};
const getQuestionById = async (userId, id) => {
  const res = await executeQuery(
    "SELECT * FROM questions WHERE user_id=$1 AND id=$2;",
    userId,
    id,
  );
  return res.rows[0] || {};
};

const getQuestionAllUsers = async (id) => {
  const res = await executeQuery(
    "SELECT * FROM questions WHERE id=$1;",
    id,
  );
  return res.rows[0] || {};
};

const getOptionsByUserId = async (userId, id) => {
  const res = await executeQuery(
    `SELECT * FROM question_answer_options
     WHERE question_id in 
     (SELECT id FROM questions 
        WHERE user_id=$1 AND id=$2);`,
    userId,
    id,
  );
  return res.rows;
};
const getOptionsByQuestion = async (q_id) => {
  const res = await executeQuery(
    `SELECT * FROM question_answer_options
     WHERE question_id=$1;`,
    q_id,
  );
  return res.rows;
};
const getOptionById = async (id) => {
  const res = await executeQuery(
    `SELECT * FROM question_answer_options
     WHERE id=$1;`,
    id,
  );
  return res.rows[0] || {};
};
const addOption = async (question_id, option_text, is_correct) => {
  await executeQuery(
    `INSERT INTO question_answer_options(question_id,option_text,is_correct) 
    Values($1, $2, $3);`,
    question_id,
    option_text,
    is_correct,
  );
};
const deleteOption = async (id) => {
  await executeQuery(
    `DELETE FROM question_answers  
            WHERE question_answer_option_id =($1);`,
    id,
  );
  await executeQuery(
    `DELETE FROM question_answer_options 
        WHERE id=($1);`,
    id,
  );
};
const deleteQuestion = async (userId, id) => {
  await executeQuery(
    `DELETE FROM questions  
              WHERE user_id =($1) AND id =($2);`,
    userId,
    id,
  );
};

const addAnswer = async (
  user_id,
  question_id,
  question_answer_option_id,
  correct,
) => {
  await executeQuery(
    `INSERT INTO question_answers(user_id,question_id,question_answer_option_id,correct) 
    Values($1, $2, $3,$4);`,
    user_id,
    question_id,
    question_answer_option_id,
    correct,
  );
};

export {
  addAnswer,
  addOption,
  addQuestion,
  deleteOption,
  deleteQuestion,
  getOptionById,
  getOptionsByQuestion,
  getOptionsByUserId,
  getQuestionAllUsers,
  getQuestionById,
  listAllQuestions,
  listQuestionsByUser,
};
