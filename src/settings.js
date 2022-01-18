const fs = require('fs')
const path = require('path')

const flags = require('minimist')(process.argv.slice(2))
const colors = require('./colors.json')

// DEFAULT SETTINGS

const defaults = {
  repos: '',
  author: '',
  time: '1 week',
  colors: colors.text,
  background: colors.background,
  port: 8000
}

// SANITIZING INPUT

const arraySanitizer = (input) =>
  Array.isArray(input) ? input : input.split(',').map((x) => x.trim())
const sanitizers = {
  repos: arraySanitizer,
  author: (x) => x,
  time: (time) => {
    let [num, unit] = typeof time === 'string' ? time.split(' ') : [time]
    num = parseInt(num, 10)
    unit = unit || 'days'
    return [num, unit]
  },
  colors: (colors) => arraySanitizer(colors).concat(defaults.colors),
  background: (x) => x,
  port: (x) => Number(x)
}

// GETTING SANTIZED SETTINGS FROM PROCESS ARGS, CONFIG FILE, OR DEFAULTS

let config = {}
try {
  config = require(path.join(process.cwd(), 'commit-viewer.config.json'))
} catch (e) {}

const args = {
  repos: flags.repos || flags.r,
  author: flags.author || flags.a,
  time: flags.time || flags.t,
  colors: flags.color || flags.c,
  background: flags.background || flags.bg || flags.b,
  port: flags.port || flags.p
}

const settings = Object.keys(sanitizers).reduce((result, key) => {
  result[key] = sanitizers[key](args[key] || config[key] || defaults[key])
  return result
}, {})


module.exports = settings
