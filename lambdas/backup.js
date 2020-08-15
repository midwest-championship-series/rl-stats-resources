const fs = require('fs')
const zlib = require('zlib')
const aws = require('aws-sdk')
const moment = require('moment')
const { exec } = require('child_process')

const mongodump = ({ username, password, host, database, outPath }) => {
  return new Promise((resolve, reject) => {
    exec(
      `mongodump --uri mongodb+srv://${username}:${password}@${host}/${database} --out ${outPath}`,
      (error, stdout) => {
        if (error) return reject(error)
        return resolve(stdout)
      },
    )
  })
}

const handler = async event => {
  const { dir } = event
  const { database } = event
  const { MONGODB_USERNAME_PROD, MONGODB_HOST_PROD, MONGODB_PASSWORD_PROD } = process.env
  const outPath = `/tmp/${moment().format('MM-DD-YYYY')}`
  console.log(outPath)
  try {
    const stdout = await mongodump({
      username: MONGODB_USERNAME_PROD,
      password: MONGODB_PASSWORD_PROD,
      host: MONGODB_HOST_PROD,
      database,
      outPath,
    })
    console.log(fs.readdirSync(outPath))
    return stdout
  } catch (err) {
    console.error(err)
    return {
      path: process.env.PATH,
      dir: fs.readdirSync(dir),
    }
  }
}

module.exports = { handler }
