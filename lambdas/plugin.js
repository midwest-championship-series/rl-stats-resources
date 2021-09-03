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
      headers: obj,
      body: '',
    }
    callback(null, response)
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: "Couldn't retrieve object info.",
    })
  }
}

const download = async event => {
  try {
    const obj = await s3
      .getObject({
        Bucket: 'mncs-plugin-bucket',
        Key: 'MNCS.dll',
      })
      .promise()
    return obj
  } catch (err) {
    return err
  }
}

module.exports = { handler, download }
