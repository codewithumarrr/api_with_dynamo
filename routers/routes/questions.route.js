const express = require("express");
const router = express.Router();
const DynamoDBFunctions = require(`./dynamodbfunctions`); // Import your DynamoDB functions module

const getQuestions = async (req, res) => {
  try {
    const questions = await DynamoDBFunctions.getQuestions();
    res.status(200).json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getRandomQuestions = async (req, res) => {
  const number = parseInt(req.params.number);
  try {
    const questions = await DynamoDBFunctions.getRandomQuestions(number);
    res.status(200).json(questions);
  } catch (err) {
    console.error("Error fetching random questions:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getQuestionById = async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const question = await DynamoDBFunctions.getQuestionById(questionId);
    if (!question) {
      res.status(404).json({ error: "Question not found" });
    } else {
      res.status(200).json(question);
    }
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const postQuestion = async (req, res) => {
  const { question } = req.body;
  try {
    await DynamoDBFunctions.postQuestion(question);
    res.status(201).json({ message: "Question added successfully" });
  } catch (err) {
    console.error("Error adding question:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const postQuestionAnswerCombined = async (req, res) => {
  const { question, correct_answer, option_a, option_b, option_c, option_d } =
    req.body;

  try {
    // Perform the first transaction (create question) and await its completion
    const newQuestionId = await DynamoDBFunctions.createQuestion(question);

    // Perform the second transaction (create answer) using the newQuestionId

    await DynamoDBFunctions.createAnswer(
      newQuestionId,
      correct_answer,
      option_a,
      option_b,
      option_c,
      option_d
    );

    res.status(201).json({ message: "Question and answer added successfully" });
  } catch (err) {
    console.error("Error adding question and answer:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getQuestions,
  getRandomQuestions,
  getQuestionById,
  postQuestion,
  postQuestionAnswerCombined,
};
