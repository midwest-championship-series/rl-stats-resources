const AWS = require('aws-sdk')

// Configure AWS Credentials
var credentials = new AWS.SharedIniFileCredentials({ profile: 'rl-stats' })
AWS.config.credentials = credentials

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

module.exports = {
  s3,
}
