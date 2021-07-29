const fs = require('fs')
const unzipper = require('unzipper')

const { s3 } = require('../src/aws')
const { mongorestore, dropDatabases } = require('../src/mongo')

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
  const downloadPath = `/tmp`
  const dumpPath = `${downloadPath}/dump`
  try {
    const { backupKey, restoreTo } = event
    if (!backupKey) throw new Error('backup key required')
    const { BACKUPS_BUCKET } = process.env
    const { username, password, host } = getConnection(restoreTo)
    await getAndUnzip(backupKey, BACKUPS_BUCKET, downloadPath)
    if (!fs.existsSync(dumpPath)) throw new Error('no dump folder located to restore from')
    await dropDatabases({ databases: fs.readdirSync(dumpPath), username, password, host })
    await mongorestore({ username, password, host, dumpPath })
  } catch (err) {
    console.error(err)
    return err
  }
}

module.exports = { handler }
