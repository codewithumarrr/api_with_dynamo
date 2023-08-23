const AWS = require('aws-sdk');

// Set your AWS credentials and region
AWS.config.update({
  accessKeyId: 'AKIAUDAEBX3VPBFOR2P3',
  secretAccessKey: 'E6u3DBJMwUrNNc+j5jt0X5LhERAPk4WRTVFpCe4C',
  region: 'us-east-1'
});

const dynamoDB = new AWS.DynamoDB();

const connectDB = () => {
  console.log("Connected to DynamoDB!");
};

const closeDBConnection = () => {
  console.log("Disconnected from DynamoDB");
  process.exit(0);
};

// SIGINT and SIGTERM event listeners are not necessary for DynamoDB

module.exports = { connectDB, closeDBConnection, dynamoDB };
