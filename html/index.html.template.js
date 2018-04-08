const moment = require('moment')
const { get } = require('lodash')

moment.suppressDeprecationWarnings = true

module.exports = ({ commits, colors }) => {
  const commitsByDay = commits.reduce(
    (result, commit) => {
      const day = moment(commit.authorDate).format('YYYY-MM-DD')
      return {
        ...result,
        [day]: (result[day] || []).concat(commit)
      }
    },
    {}
  )

  



 return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>title</title>
  <link rel="stylesheet" href="//fonts.googleapis.com/css?family=font1|font2|etc" type="text/css">
  <link rel="stylesheet" href="main.css" type="text/css">
  </head>
  <body>
    ${Object.keys(commitsByDay).map(day => (
    `<div class="day" id="${day}">
      <div class="day-title">${moment(day).format('dddd Do MMM')}</div>
      <div class="commits">
        ${commitsByDay[day].map(commit => (
        `<div class="commit-time">${moment(commit.authorDate).format('hh:mmaa')}</div>
        <div class="commit-info">
          <div class="commit-repo">${commit.repo}</div>
          <div class="commit-message">${commit.subject}</div>
        </div>`
        ))}
      </div>
    </div>`
    ))}
  </body>
</html>`
}