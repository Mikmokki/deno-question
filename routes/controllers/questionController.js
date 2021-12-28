import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";
const questionValidationRules = {
  title: [validasaur.required, validasaur.minLength(1)],
  question_text: [validasaur.required, validasaur.minLength(1)],
};
const optionValidationRules = {
  option_text: [validasaur.required, validasaur.minLength(1)],
};
const getQuestionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    title: params.get("title"),
    question_text: params.get("question_text"),
  };
};
const getOptionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    option_text: params.get("option_text"),
    is_correct: params.get("is_correct"),
  };
};
const addQuestion = async ({ request, response, render, user }) => {
  const questionData = await getQuestionData(request);
  const [passes, errors] = await validasaur.validate(
    questionData,
    questionValidationRules,
  );
  if (!passes) {
    console.log(errors);
    questionData.validationErrors = errors;
    questionData.questions = await questionService.listQuestionsByUser(user.id);
    console.log(questionData)
    render("questions/questions.eta", questionData);
  } else {
    await questionService.addQuestion(
      user.id,
      questionData.title,
      questionData.question_text,
    );
    response.redirect("/questions");
  }
};

const listQuestions = async ({ render, user }) => {
  render("questions/questions.eta", {
    questions: await questionService.listQuestionsByUser(user.id),
  });
};
const showQuestion = async ({ render, params, user }) => {
  render("questions/question.eta", {
    question: await questionService.getQuestionById(user.id, params.id),
    options: await questionService.getOptionsByUserId(user.id, params.id),
  });
};
const addOption = async ({ request, response, render, params, user }) => {
  const optionData = await getOptionData(request);
  const [passes, errors] = await validasaur.validate(
    optionData,
    optionValidationRules,
  );
  if (!passes) {
    console.log(errors);
    optionData.validationErrors = errors;
    optionData.question = await questionService.getQuestionById(
      user.id,
      params.id,
    ),
      optionData.options = await questionService.getOptionsByUserId(
        user.id,
        params.id,
      );
    render("questions/question.eta", optionData);
  } else {
    await questionService.addOption(
      params.id,
      optionData.option_text,
      optionData.is_correct,
    );
    response.redirect(`/questions/${params.id}`);
  }
};
const deleteOption = async ({ response, params }) => {
  await questionService.deleteOption(params.optionId);
  response.redirect(`/questions/${params.questionId}`);
};
const deleteQuestion = async ({ response, params, user }) => {
  const options = await questionService.getOptionsByUserId(user.id, params.id);
  if (options.length == 0) {
    await questionService.deleteQuestion(user.id, Number(params.id));
    response.redirect("/questions");
  }
};
export {
  addOption,
  addQuestion,
  deleteOption,
  deleteQuestion,
  listQuestions,
  showQuestion,
};
