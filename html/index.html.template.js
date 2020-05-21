const moment = require('moment')
const { get } = require('lodash')

moment.suppressDeprecationWarnings = true

module.exports = ({ commits, colors, background }) => {
  const commitsByDay = commits.reduce((result, commit) => {
    const day = moment(commit.authorDate).format('YYYY-MM-DD')
    return {
      ...result,
      [day]: (result[day] || []).concat(commit)
    }
  }, {})

  const repoColors = commits.reduce((result, { repo }) => {
    if (!result[repo]) {
      result[repo] = colors.shift()
    }
    return result
  }, {})

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Commit Viewer</title>
    <link href="https://fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet">
    <link rel="stylesheet" href="main.css" type="text/css">
    <style>
      body { background-color: ${background}; }
    </style>
  </head>
  <body>
    <div id="container">
      ${Object.keys(commitsByDay)
        .sort((a, b) => {
          return new Date(b) - new Date(a)
        })
        .map(
          (day) =>
            `<div class="day" id="${day}">
        <div class="day-title">${moment(day).format('dddd Do MMM')}</div>
        <div class="commits">
          ${commitsByDay[day]
            .map(
              (commit) =>
                `<div class="commit" style="color:${repoColors[commit.repo]};">
            <div class="commit-meta">
              <span class="commit-time">
                ${moment(commit.authorDate).format('hh:mma')}
              </span>
              <span class="separator"> / </span>
              <span class="commit-repo">${commit.repo}</span>
            </div>
            <div class="commit-message">${commit.subject}</div>
          </div>`
            )
            .join('\n')}
        </div>
      </div>`
        )
        .join('\n')}
    </div>
  </body>
</html>`
}
