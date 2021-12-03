const { s3 } = require('../src/aws')

const handler = async (event, context, callback) => {
  try {
    const obj = await s3
      .headObject({
        Bucket: 'rl-plugin',
        Key: 'SOSIO.dll',
      })
      .promise()
    const response = {
      statusCode: 200,
      body: JSON.stringify({ ...obj, Location: 'https://rl-plugin.s3.us-east-2.amazonaws.com/SOSIO.dll' }),
    }
    callback(null, response)
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: "{'error':'Failed to retrieve object.'}",
    })
  }
}

module.exports = { handler }
