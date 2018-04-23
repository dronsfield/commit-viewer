const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const express = require('express')
const opn = require('opn')

const settings = require('./settings')
const commits = require('./commits')
const htmlTemplate = require('../html/index.html.template')

const build = () => {
  if (!commits.length) {
    console.log('no commits found')
    return
  }

  const rpath = x => path.join(__dirname, x)

  const replicateFile = (name, cb) => {
    fs.createReadStream(rpath(`../html/${name}`))
    .pipe(fs.createWriteStream(rpath(`../build/${name}`)))
    .on('finish', cb)
  }

  let buildTasks = [
    cb => mkdirp(rpath('../build'), cb),
    cb => replicateFile('main.css', cb),
    cb => fs.writeFile(
      rpath('../build/index.html'),
      htmlTemplate({ commits, ...settings }),
      cb
    )
  ]

  const execTasks = (tasks, cb) => (
    tasks.reduceRight(
      (acc, task) => () => task(acc),
      cb
    )()
  )

  const serve = () => {
    const app = express()
    app.use(express.static(rpath('../build')))
    app.listen(8000, () => {
      console.log('view your commits at http://localhost:8000')
      opn('http://localhost:8000/')
    })
  }

  execTasks(buildTasks, serve)
}

module.exports = build
