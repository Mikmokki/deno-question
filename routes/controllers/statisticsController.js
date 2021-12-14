import * as statisticsService from "../../services/statisticsService.js";

const showStats = async ({ render, user }) => {
  const noOfAnswers = (await statisticsService.userAnswerAmount(user.id)).count;
  const noOfCorrectAnswers =
    (await statisticsService.userCorrectAnswerAmount(user.id)).count;
  const noOfCreated =
    (await statisticsService.userCreatedAmount(user.id)).count;
  const noOfQuestionAnswers =
    (await statisticsService.answersToUsers(user.id)).count;
  const topFive = await statisticsService.getFiveMostAnswers();
  console.log(topFive);
  render("statistics/statistics", {
    noOfAnswers,
    noOfCorrectAnswers,
    noOfCreated,
    noOfQuestionAnswers,
    topFive,
  });
};

export { showStats };
