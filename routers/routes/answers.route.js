const express = require("express");
const router = express.Router();
const DynamoDBFunctions = require("./dynamodbfunctions"); // Import your DynamoDB functions module

const getAnswersByQuestionId = async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const answers = await DynamoDBFunctions.getAnswersByQuestionId(questionId);
    res.status(200).json(answers);
  } catch (err) {
    console.error("Error fetching answers:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getAllAnswers = async (req, res) => {
  try {
    const answers = await DynamoDBFunctions.getAllAnswers();
    res.status(200).json(answers);
  } catch (err) {
    console.error("Error fetching answers:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateUserAnswer = async (req, res) => {
  const questionId = req.params.questionId;
  const userAnswer = req.body.userAnswer;

  if (!userAnswer) {
    res.status(400).json({ error: "User answer cannot be empty" });
    return;
  }

  try {
    await DynamoDBFunctions.updateUserAnswer(questionId, userAnswer);
    res.json({ message: "User answer saved successfully" });
  } catch (err) {
    console.error("Error updating user answer:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getAnswersByQuestionId,
  getAllAnswers,
  updateUserAnswer,
};
