const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getRandomQuestions,
  getQuestionById,
  postQuestion,
  postQuestionAnswerCombined,
} = require("./routes/questions.route");

const {
  getAnswersByQuestionId,
  getAllAnswers,
  updateUserAnswer,
} = require("./routes/answers.route");

// registr single question
router.post("/questions", postQuestion);

// combined query... jst to get id before registering answer nd options..
router.post("/answers", postQuestionAnswerCombined);

// updating user_answer...
router.post("/answers/:questionId", updateUserAnswer);

// get all questions
router.get("/questions", getQuestions);

// random questions count
router.get("/random_questions/:number", getRandomQuestions);

// get question by Id
router.get("/questions/:questionId", getQuestionById);

// get specific answer
router.get("/answers/:questionId", getAnswersByQuestionId);

// get all answers
router.get("/answers", getAllAnswers);

module.exports = router;
