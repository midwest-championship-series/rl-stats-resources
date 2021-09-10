const AWS = require('aws-sdk')

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

module.exports = {
  s3,
}
