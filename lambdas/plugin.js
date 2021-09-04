const { s3 } = require('../src/aws')

const handler = async (event, context, callback) => {
  console.log('event', event, 'context', context, 'callback', callback)
  try {
    const obj = await s3
      .headObject({
        Bucket: 'mncs-plugin-bucket',
        Key: 'MNCS.dll',
      })
      .promise()
    const response = {
      statusCode: 200,
      body: JSON.stringify(obj),
    }
    callback(null, response)
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: "{'error':'Failed to retrieve object.'}",
    })
  }
}

const download = async event => {
  try {
    return {
      statusCode: 302,
      headers: {
        Location: 'https://mncs-plugin-bucket.s3.us-east-2.amazonaws.com/MNCS.dll',
      },
    }
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: "{'error':'Failed to retrieve object.'}",
    })
  }
}

module.exports = { handler, download }
