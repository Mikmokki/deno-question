import * as questionService from "../../services/questionService.js";

const generateQuiz = async ({ response }) => {
  const allQuestions = await questionService.listAllQuestions();
  const question = allQuestions.length > 0 &&
    allQuestions[Math.floor(allQuestions.length * Math.random())];
  question;
  question
    ? response.redirect(`/quiz/${question.id}`)
    : response.redirect("/quiz/notFound");
};

const showQuiz = async ({ render, params }) => {
  const question = await questionService.getQuestionAllUsers(params.id);
  const options = question && await questionService.getOptionsByUserId(
    question.user_id,
    question.id,
  );
  question
    ? render("quiz/quiz.eta", {
      question: question,
      options: options,
    })
    : render("quiz/quiz.eta");
};
const addAnswer = async ({ response, params, user }) => {
  const option = await questionService.getOptionById(params.optionId);
  if (option && option.is_correct) {
    await questionService.addAnswer(
      user.id,
      params.id,
      params.optionId,
      option.is_correct,
    );
    response.redirect(`/quiz/${params.id}/correct`);
  } else {
    await questionService.addAnswer(
      user.id,
      params.id,
      params.optionId,
      false,
    );
    response.redirect(`/quiz/${params.id}/incorrect`);
  }
};
const showCorrect = ({ render }) => {
  render("quiz/correct.eta");
};
const showIncorrect = async ({ render, params }) => {
  const options = await questionService.getOptionsByQuestion(
    params.id,
  );
  const filtered = options.filter((o) => o.is_correct);
  render("quiz/incorrect.eta", {
    correct: filtered.length > 0
      ? filtered[0].option_text
      : "is not yet been added",
  });
};
export { addAnswer, generateQuiz, showCorrect, showIncorrect, showQuiz };
