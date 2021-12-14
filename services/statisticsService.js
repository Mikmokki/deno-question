import { executeQuery } from "../database/database.js";

const userAnswerAmount = async (userId) => {
  const res = await executeQuery(
    `SELECT count(*)
    FROM question_answers
    WHERE user_id=$1`,
    userId,
  );

  return res.rows[0];
};
const userCorrectAnswerAmount = async (userId) => {
  const res = await executeQuery(
    `SELECT count(*)
    FROM question_answers
    WHERE user_id=$1 AND correct=true`,
    userId,
  );

  return res.rows[0];
};
const userCreatedAmount = async (userId) => {
  const res = await executeQuery(
    `SELECT count(*)
    FROM questions
    WHERE user_id=$1;`,
    userId,
  );

  return res.rows[0];
};

const answersToUsers = async (userId) => {
  const res = await executeQuery(
    `SELECT count(*)
    FROM question_answers
    WHERE question_id IN(
      SELECT id
      FROM questions
      WHERE user_id=$1
    );`,
    userId,
  );

  return res.rows[0];
};

const getFiveMostAnswers = async () => {
  const res = await executeQuery(
    `SELECT users.email as email, count(*) as count FROM users
    JOIN question_answers ON users.id = question_answers.user_id
    GROUP BY users.email
    ORDER BY count DESC
    LIMIT 5`,
  );

  return res.rows;
};

export {
  answersToUsers,
  getFiveMostAnswers,
  userAnswerAmount,
  userCorrectAnswerAmount,
  userCreatedAmount,
};
