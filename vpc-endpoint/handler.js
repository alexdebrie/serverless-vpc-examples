const AWS = require('aws-sdk')
const SNS = new AWS.SNS()

module.exports.main = async () => {
  const params = {
    Message: 'Hello, from your Lambda in a VPC using a VPC endpoint!',
    PhoneNumber: process.env.SMS_NUMBER
  }
  await SNS.publish(params).promise()
};
