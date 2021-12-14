import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";
import * as userController from "./controllers/userController.js";
import * as quizController from "./controllers/quizController.js";
import * as statisticsController from "./controllers/statisticsController.js";
import * as questionApi from "./apis/questionApi.js";

const router = new Router();

router.get("/", mainController.showMain);
router.get("/questions", questionController.listQuestions);
router.post("/questions", questionController.addQuestion);
router.get("/questions/:id", questionController.showQuestion);
router.post("/questions/:id/options", questionController.addOption);
router.post(
  "/questions/:questionId/options/:optionId/delete",
  questionController.deleteOption,
);
router.post("/questions/:id/delete", questionController.deleteQuestion);

router.get("/auth/register", userController.showRegistrationForm);
router.post("/auth/register", userController.registerUser);
router.get("/auth/login", userController.showLoginForm);
router.post("/auth/login", userController.processLogin);

router.get("/quiz", quizController.generateQuiz);
router.get("/quiz/:id", quizController.showQuiz);
router.post("/quiz/:id/options/:optionId", quizController.addAnswer);
router.get("/quiz/:id/correct", quizController.showCorrect);
router.get("/quiz/:id/incorrect", quizController.showIncorrect);

router.get("/statistics", statisticsController.showStats);
router.get("/api/questions/random", questionApi.getRandomQuestion);
router.post("/api/questions/answer", questionApi.postAnswer);
export { router };
