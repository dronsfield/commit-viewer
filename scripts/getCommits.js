const gitlog = require('gitlog');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

const config = require('../config')
const { repos, author } = config

const getAbsolutePath = relPath => {
  const dots = relPath.lastIndexOf('..')
  const climb = relPath.slice(0, dots) + '../..'
  const rest = relPath.slice(dots + 3)
  return path.join(__dirname, climb, rest)
}

const commitsJson = []

repos.forEach(repoRelPath => {
  const options = {
    repo: getAbsolutePath(repoRelPath),
    since: moment().startOf('day').subtract(3, 'month').toDate(),
    nameStatus: false,
    fields: [
      'hash',
      'authorName',
      'authorEmail',
      'authorDate',
      'subject'
    ]
  }
  try {
    const commits = gitlog(options)
      .filter(commit => {
        if (author) {
          return (
            commit.authorName === author ||
            commit.authorEmail === author
          )
        }
        else {
          return true
        }
      })
      .map(commit => ({
        ...commit,
        repo: path.basename(repoRelPath)
      }))

    console.log(`found ${commits.length} commits from repo '${repoRelPath}'`)
    commitsJson.push(...commits)
  } catch(e) {
    console.log(`couldn't find repo '${repoRelPath}'`)
  }
})

commitsJson.sort((a, b) => {
  return new Date(a.authorDate) - new Date(b.authorDate)
})

fs.writeFileSync('commits.json', JSON.stringify(commitsJson, null, '\t'))