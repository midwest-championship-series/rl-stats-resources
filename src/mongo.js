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

const mongorestore = ({ username, password, host, database }) => {}

module.exports = {
  mongodump,
  mongorestore,
}
