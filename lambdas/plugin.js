const { s3 } = require('../src/aws')

const handler = async (event, context, callback) => {
  try {
    const obj = await s3
      .headObject({
        Bucket: 'mncs-plugin-bucket',
        Key: 'MNCS.dll',
      })
      .promise()
    const response = {
      statusCode: 200,
      body: JSON.stringify({ ...obj, Location: 'https://mncs-plugin-bucket.s3.us-east-2.amazonaws.com/MNCS.dll' }),
    }
    callback(null, response)
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: "{'error':'Failed to retrieve object.'}",
    })
  }
}

module.exports = { handler, download }
