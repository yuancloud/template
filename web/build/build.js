require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')

// import context from '../src/common/js/front.context.g'
// let vs = context.version
// const d = new Date();
// console.log(new Date())
// let month = d.getMonth();
// month = month < 10 ? `0${month}` : month;
// let day = d.getDate();
// day = day < 10 ? `0${day}` : day;
// let hours = d.getHours() + 1;
// hours = hours < 10 ? `0${hours}` : hours;
// let minutes = d.getMinutes()
// minutes = minutes < 10 ? `0${minutes}` : minutes;
//   // console.log(`${vs}.${d.getMonth() + 1}${day}${hours}${minutes}`)
// vs = `${vs}.${d.getMonth() + 1}${day}${hours}${minutes}`
// console.log(vs)

spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {

    //const context = require('../src/common/js/front.context.g')
    console.log()
    if (err) throw err
    webpack(webpackConfig, function(err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})