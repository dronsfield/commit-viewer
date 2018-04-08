const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const express = require('express')
const opn = require('opn')

const commits = require('./commits')
const htmlTemplate = require('../html/index.html.template')({ commits })

const rpath = x => path.join(__dirname, x)

const replicateFile = (name, cb) => {
  fs.createReadStream(rpath(`../html/${name}`))
  .pipe(fs.createWriteStream(rpath(`../build/${name}`)))
  .on('finish', cb)
}

let buildTasks = [
  cb => mkdirp(rpath('../build'), cb),
  cb => replicateFile('main.css', cb),
  cb => fs.writeFile(rpath('../build/index.html'), htmlTemplate, cb)
]

const execTasks = (tasks, cb) => {
  const rfn = n => {
    if (tasks[n + 1]) {
      tasks[n](() => {
        rfn(n + 1)
      })
    } else {
      tasks[n](cb)
    }
  }
  rfn(0)
}

const app = express()

execTasks(
  buildTasks,
  x => {
    app.use(express.static(rpath('../build')))
    app.listen(4000, () => {
      console.log('listening on 4000')
      opn('http://localhost:4000/')
    })
  }
)