var fs = require('fs')
var path = require('path')
var common = require('./common')
module.exports.execute = function execute(cwd) {
    let tar = path.join(cwd, '..', 'web', 'static', 'json');
    if (!fs.existsSync(tar)) fs.mkdirSync(tar);
    fs.writeFileSync(common.genfilelog(path.join(tar, 'router.g.json')), gen(tar), 'utf-8');
    tar = path.join(cwd, '..', 'vue', 'static', 'json');
    if (!fs.existsSync(tar)) fs.mkdirSync(tar);
    fs.writeFileSync(common.genfilelog(path.join(tar, 'router.g.json')), gen(tar), 'utf-8');

    tar = path.join(cwd, '..', 'test', 'static', 'json');
    if (!fs.existsSync(tar)) fs.mkdirSync(tar);
    fs.writeFileSync(common.genfilelog(path.join(tar, 'router.g.json')), gen(tar), 'utf-8');
}

function gen(routerpath) {
    var tar = path.join(routerpath, '..', '..', 'src', 'components');
    var str = ` {
  "datatime": "${new Date().toLocaleString()}",
  "routerList": [
`
    fs.readdirSync(tar).forEach((comdir, index) => {
        if (comdir.toLowerCase() != 'common' && fs.statSync(path.join(tar, comdir)).isDirectory())
            fs.readdirSync(path.join(tar, comdir)).forEach((subdir, index) => {
                if (fs.statSync(path.join(tar, comdir, subdir)).isDirectory())
                    fs.readdirSync(path.join(tar, comdir, subdir)).forEach((file, index) => {
                        if (fs.statSync(path.join(tar, comdir, subdir, file)).isFile() && file.toLowerCase().endsWith('.vue')) {
                            str += `
            "${path.join(tar, comdir, subdir, file).replace( tar, '').replace(/\\/g, '/').substring(1)}",`
                        }
                    });
            });
    });
    str = str.substr(0, str.lastIndexOf(',')) +
        `
  ]
} `

    return str
}