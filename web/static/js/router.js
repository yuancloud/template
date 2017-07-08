const fs = require('fs')
const path = require('path')
let currentPath = path.join(__dirname, '../', '../', 'src', 'components')

let pathArr = []

const readFile = (src) => {
  if (!src) return 'end'
  fs.readdir(`${src}`, (err, result) => {
    if (result.length == 0) return console.log(`${src}`)
    for (let i = 0, len = result.length; i < len; i++) {
      if (result[i] == '.DS_Store') continue
      readFile(`${src}/${result[i]}`)
    }
  })
}

readFile(currentPath)
