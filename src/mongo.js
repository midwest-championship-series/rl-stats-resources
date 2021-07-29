const { exec } = require('child_process')
const { MongoClient } = require('mongodb')

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

const mongorestore = ({ username, password, host, dumpPath }) => {
  return new Promise((resolve, reject) => {
    exec(`mongorestore --uri mongodb+srv://${username}:${password}@${host} ${dumpPath}`, (err, stdout) => {
      if (err) return reject(err)
      console.log(stdout)
      return resolve()
    })
  })
}

const dropDatabases = async ({ databases, username, password, host }) => {
  for (let database of databases) {
    await new Promise((resolve, reject) => {
      const url = `mongodb+srv://${username}:${password}@${host}`
      MongoClient.connect(url, async (err, client) => {
        if (err) return reject(err)
        await client.db(database).dropDatabase()
        client.close()
        return resolve()
      })
    })
  }
}

module.exports = {
  mongodump,
  mongorestore,
  dropDatabases,
}
