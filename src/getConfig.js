const fs = require('fs')
const path = require('path')

let config = {}
try {
  config = require(path.join(process.cwd(), 'commit-viewer.config.json'))
} catch (e) {}

const { repos, author } = config

module.exports = {
  repos,
  author
}