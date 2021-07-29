const fs = require('fs')
const unzipper = require('unzipper')

const { s3 } = require('../src/aws')

const getConnection = restoreTo => {
  if (restoreTo === 'prod') {
    return {
      username: process.env.MONGODB_USERNAME_PROD,
      password: process.env.MONGODB_PASSWORD_PROD,
      host: process.env.MONGODB_HOST_PROD,
    }
  } else {
    return {
      username: process.env.MONGODB_USERNAME_DEV,
      password: process.env.MONGODB_PASSWORD_DEV,
      host: process.env.MONGODB_HOST_DEV,
    }
  }
}

const getAndUnzip = async (Key, Bucket, path) => {
  return new Promise((resolve, reject) => {
    s3.getObject({ Key, Bucket })
      .createReadStream()
      .pipe(unzipper.Extract({ path }))
      .on('error', err => {
        reject(err)
      })
      .on('close', () => {
        resolve()
      })
  })
}

const handler = async event => {
  const { backupKey, restoreTo } = event
  if (!backupKey) throw new Error('backup key required')
  const { BACKUPS_BUCKET } = process.env
  const { username, password, host } = getConnection(restoreTo)
  // const downloadPath = `/tmp/${backupKey.split('/').slice('-1').pop()}`
  const downloadPath = `/tmp`
  await getAndUnzip(backupKey, BACKUPS_BUCKET, downloadPath)
  // fs.writeFileSync(downloadPath, Body)
  // console.log(fs.readdirSync('/tmp'))
  return fs.readdirSync(downloadPath)
}

module.exports = { handler }
