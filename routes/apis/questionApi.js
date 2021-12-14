import * as questionService from "../../services/questionService.js";
const getRandomQuestion = async ({ response }) => {
  const allQuestions = await questionService.listAllQuestions();
  const question = allQuestions.length > 0 &&
    allQuestions[Math.floor(allQuestions.length * Math.random())];
  question;
  if (question) {
    const options = await questionService.getOptionsByQuestion(question.id);
    response.body = {
      questionId: question.id,
      questionTitle: question.title,
      questionText: question.question_text,
      answerOptions: options.map((o) => ({
        optionId: o.id,
        optionText: o.option_text,
      })),
    };
  } else response.body = "";
};
const postAnswer = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  console.log(body);
  const answer = await body.value;
  const option = await questionService.getOptionById(answer.optionId);
  option && option.is_correct
    ? (response.body = { correct: true })
    : (response.body = { correct: false });
};
export { getRandomQuestion, postAnswer };
