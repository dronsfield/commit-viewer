const gitlog = require('gitlog');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

const { repos, author, time } = require('./settings')

const getAbsolutePath = relPath => {
  const dots = relPath.lastIndexOf('..')
  const climb = relPath.slice(0, dots) + '../..'
  const rest = relPath.slice(dots + 3)
  return path.join(process.cwd(), climb, rest)
}

const allCommits = []

repos.forEach(repo => {
  // const path = path.join(process.cwd(), repo)
  // console.log(path)
  const options = {
    repo: path.join(process.cwd(), repo),
    since: moment().startOf('day').subtract(...time).toDate(),
    nameStatus: false,
    number: 99999,
    fields: [
      'hash',
      'authorName',
      'authorEmail',
      'authorDate',
      'subject'
    ],
    all: true
  }
  try {
    const commits = (
      gitlog(options)
      .filter(commit => {
        if (author) {
          return (
            commit.authorName.includes(author) ||
            commit.authorEmail.includes(author)
          )
        }
        else {
          return true
        }
      })
      .map(commit => ({
        ...commit,
        repo: path.basename(repo)
      }))
    )

    allCommits.push(...commits)
  }
  catch(e) {
    console.log(`couldn't find repo '${repo}'`)
  }
})

allCommits.sort((a, b) => {
  return new Date(a.authorDate) - new Date(b.authorDate)
})

allCommits.toString = () => `${allCommits.length} commits by ${author} from the last ${time[0]} ${time[1]}`

console.log(`found ${allCommits.toString()}`)

module.exports = allCommits
