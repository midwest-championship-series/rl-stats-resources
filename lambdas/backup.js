const fs = require('fs')
const zip = require('zip-a-folder')
const moment = require('moment')

const { mongodump } = require('../src/mongo')
const { s3 } = require('../src/aws')

const zipFolder = outPath => {
  return new Promise((resolve, reject) => {
    const zipName = `${outPath}.zip`
    zip.zipFolder(outPath, zipName, err => {
      if (err) reject(err)
      return resolve(zipName)
    })
  })
}

const handler = async event => {
  const { database } = event
  const { MONGODB_USERNAME_PROD, MONGODB_HOST_PROD, MONGODB_PASSWORD_PROD, BACKUPS_BUCKET } = process.env
  const dateStr = `${moment().format('MM-DD-YYYY')}-${Date.now()}`
  const zipPath = `/tmp/${dateStr}`
  const outPath = `${zipPath}/dump`
  await mongodump({
    username: MONGODB_USERNAME_PROD,
    password: MONGODB_PASSWORD_PROD,
    host: MONGODB_HOST_PROD,
    database,
    outPath,
  })
  const zipped = await zipFolder(zipPath)
  const data = fs.readFileSync(zipped)
  const bucketParams = {
    Bucket: BACKUPS_BUCKET,
    Key: `${database}/${dateStr}.zip`,
    Body: data,
    ContentType: 'application/zip',
  }
  await s3.upload(bucketParams).promise()
  fs.unlinkSync(zipped)
  return { uploaded: bucketParams.Key }
}

module.exports = { handler }
