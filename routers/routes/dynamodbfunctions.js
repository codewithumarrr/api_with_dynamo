const AWS = require("aws-sdk");
const uuid = require("uuid");
const dynamoDB = new AWS.DynamoDB();

const generateUniqueId = () => {
  return uuid.v4();
};

const getQuestions = async () => {
  try {
    const scanParams = {
      TableName: "questions",
    };

    return new Promise((resolve, reject) => {
      dynamoDB.scan(scanParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const questions = data.Items.map((item) => ({
            id: item.id.S,
            question: item.question.S,
          }));
          resolve(questions);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

const getRandomQuestions = async (number) => {
  try {
    const scanParams = {
      TableName: "questions",
    };

    return new Promise((resolve, reject) => {
      dynamoDB.scan(scanParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const totalQuestions = data.Items.length;
          const randomIndices = new Set();
          while (randomIndices.size < Math.min(number, totalQuestions)) {
            randomIndices.add(Math.floor(Math.random() * totalQuestions));
          }

          const randomQuestions = Array.from(randomIndices).map((index) => ({
            id: data.Items[index].id.S,
            question: data.Items[index].question.S,
          }));
          resolve(randomQuestions);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

const getQuestionById = async (questionId) => {
  try {
    const queryParams = {
      TableName: "questions",
      Key: {
        id: { S: questionId },
      },
    };

    return new Promise((resolve, reject) => {
      dynamoDB.getItem(queryParams, (err, data) => {
        if (err) {
          reject(err);
        } else if (!data.Item) {
          resolve(null);
        } else {
          const question = {
            id: data.Item.id.S,
            question: data.Item.question.S,
          };
          resolve(question);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

const postQuestion = async (question) => {
  try {
    const questionId = generateUniqueId(); // Implement a unique ID generation function
    const putParams = {
      TableName: "questions",
      Item: {
        id: { S: questionId },
        question: { S: question },
      },
    };

    return new Promise((resolve, reject) => {
      dynamoDB.putItem(putParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

// const postQuestionAnswerCombined = async (
//   question,
//   correct_answer,
//   option_a,
//   option_b,
//   option_c,
//   option_d
// ) => {
//   try {
//     const questionId = generateUniqueId(); // Implement a unique ID generation function
//     const putQuestionParams = {
//       TableName: "questions",
//       Item: {
//         id: { S: questionId },
//         question: { S: question },
//       },
//     };

//     const putAnswerParams = {
//       TableName: "answers",
//       Item: {
//         question_id: { S: questionId },
//         correct_answer: { S: correct_answer },
//         option_a: { S: option_a },
//         option_b: { S: option_b },
//         option_c: { S: option_c },
//         option_d: { S: option_d },
//       },
//     };

//     return new Promise((resolve, reject) => {
//       dynamoDB.transactWriteItems(
//         {
//           TransactItems: [{ Put: putQuestionParams }, { Put: putAnswerParams }],
//         },
//         (err, data) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve();
//           }
//         }
//       );
//     });
//   } catch (err) {
//     throw err;
//   }
// };

const getAnswersByQuestionId = async (questionId) => {
  try {
    const queryParams = {
      TableName: "answers",
      KeyConditionExpression: "question_id = :id",
      ExpressionAttributeValues: {
        ":id": { S: questionId },
      },
    };

    return new Promise((resolve, reject) => {
      dynamoDB.query(queryParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const answers = data.Items.map((item) => ({
            question_id: item.question_id.S,
            correct_answer: item.correct_answer.S,
            option_a: item.option_a.S,
            option_b: item.option_b.S,
            option_c: item.option_c.S,
            option_d: item.option_d.S,
          }));
          resolve(answers);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

const getAllAnswers = async () => {
  try {
    const scanParams = {
      TableName: "answers",
    };

    return new Promise((resolve, reject) => {
      dynamoDB.scan(scanParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const answers = data.Items.map((item) => ({
            question_id: item.question_id.S,
            correct_answer: item.correct_answer.S,
            option_a: item.option_a.S,
            option_b: item.option_b.S,
            option_c: item.option_c.S,
            option_d: item.option_d.S,
          }));
          resolve(answers);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

const updateUserAnswer = async (questionId, userAnswer) => {
  try {
    const updateParams = {
      TableName: "answers",
      Key: {
        question_id: { S: questionId },
      },
      UpdateExpression: "SET user_answer = :answer",
      ExpressionAttributeValues: {
        ":answer": { S: userAnswer },
      },
    };

    return new Promise((resolve, reject) => {
      dynamoDB.updateItem(updateParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

const createQuestion = async (questionText) => {
  try {
    const questionId = generateUniqueId(); // Generate a unique question ID
    const params = {
      TableName: "questions",
      Item: {
        id: { S: questionId },
        question: { S: questionText },
      },
    };

    await new Promise((resolve, reject) => {
      dynamoDB.putItem(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    return questionId;
  } catch (err) {
    throw err;
  }
};

const createAnswer = async (
  questionId,
  correctAnswer,
  optionA,
  optionB,
  optionC,
  optionD
) => {
  try {
    const params = {
      TableName: "answers",
      Item: {
        question_id: { S: questionId },
        correct_answer: { S: correctAnswer },
        option_a: { S: optionA },
        option_b: { S: optionB },
        option_c: { S: optionC },
        option_d: { S: optionD },
      },
    };

    await new Promise((resolve, reject) => {
      dynamoDB.putItem(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getQuestions,
  getRandomQuestions,
  getQuestionById,
  postQuestion,
  // postQuestionAnswerCombined,
  getAnswersByQuestionId,
  getAllAnswers,
  updateUserAnswer,
  createQuestion,
  createAnswer,
};
