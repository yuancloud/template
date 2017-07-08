// 'use strict';
const express = require('express');
const timeout = require('connect-timeout');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const AV = require('leanengine');
const cors = require('cors')
const fs = require('fs')

// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
// require('./cloud')

const app = express();

app.use(cors())

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

require('./components/common/common.js');
let str = ''

fs.readdir(path.join(__dirname, 'components'), (err, files) => {
    for (let i = 0, len = files.length; i < len; i++) {
        if (files[i].toLocaleLowerCase() == '.gitkeep' || files[i].toLocaleLowerCase() == '.ds_store' || files[i].toLocaleLowerCase() == 'common') continue
        app.use(`/${files[i]}`, express.static(path.join(__dirname, 'components', files[i])))
        str = `./components/${files[i]}/${files[i]}.es5.g.js`
        require(`./components/${files[i]}/${files[i]}.es5.g.js`)
    }
})


// //  AV.User.logInWithMobilePhone('15311370851', '123').then(function (result) {

// /* 创建角色 */

// // var roleAcl = new AV.ACL();
// // roleAcl.setPublicReadAccess(true);
// // roleAcl.setPublicWriteAccess(false);

// // // 当前用户是该角色的创建者，因此具备对该角色的写权限
// // roleAcl.setWriteAccess(result, true);

// // //新建角色
// // var administratorRole = new AV.Role('Administrator', roleAcl);
// // administratorRole.save().then(function(role) {
// //   // 创建成功
// //   console.log('----------')
// //   console.log(role)
// // }).catch(function(error) {
// //   console.log(error);
// // });

// // const entity = new AV.Object('Employee')
// // entity.set('tmpName', '321')

// // const administratorRole = new AV.Role('Administrator');
// // console.log(administratorRole)


// /* 查询角色 */

// //   const roleQ = new AV.Query(AV.Role)
// //   roleQ.equalTo('name', 'Administrator')
// //   // roleQuery.equalTo('users', result);
// //   roleQ.find()
// //     .then( results => {
// //       console.log(results[0].toJSON())
// //     })

// // }, (function (error) {
// // }));

// // 上传省份
// const updateProvince = () => {
//     fs.readFile('./json/province.json', 'utf-8', (err, result) => {
//         JSON.parse(result).forEach(value => {
//             const Region = new AV.Object('Region')
//             const query = new AV.Query('Region')
//             query.equalTo('code', `${value.id}00`)
//                 .find()
//                 .then(data => {
//                     if (!data[0]) {
//                         Region.set('name', value.name)
//                         Region.set('code', value.id + '00')
//                         Region.save()
//                     } else {
//                         // console.log(data[0].toJSON().code + '---' + data[0].toJSON().name + '---已经存在')
//                     }
//                 })
//         })
//     })
// }

// // 上传市
// const updateCity = () => {
//     fs.readFile('./json/city.json', 'utf-8', (err, result) => {
//         if (err) return console.error(err)
//         const data1 = Object.keys(JSON.parse(result))
//         const data = []
//         data1.forEach(value => {
//             data.push(JSON.parse(result)[value])
//         })
//         // console.log(data)
//         data.forEach(value => {
//             value.forEach(item => {
//                 // console.log(item.name)
//                 // console.log(item.id)
//                 const Region = new AV.Object('Region')
//                 const query = new AV.Query('Region')
//                 query.equalTo('code', `${item.id}00`)
//                     .find()
//                     .then(data => {
//                         if (!data[0]) {
//                             // console.log(data)
//                             Region.set('name', item.name)
//                             Region.set('code', item.id + '00')
//                             Region.save()
//                         } else {
//                             // console.log(data[0].toJSON().code + '---' + data[0].toJSON().name + '---已经存在')
//                         }
//                     })
//             })
//         })
//     })
// }

// // 上传县/区
// const updateArea = () => {
//     fs.readFile('./json/area.json', 'utf-8', (err, result) => {
//         // const data = Object.values(JSON.parse(result))
//         const data1 = Object.keys(JSON.parse(result))
//         const data = []
//         data1.forEach(value => {
//             data.push(JSON.parse(result)[value])
//         })
//         data.forEach((value, index) => {
//             value.forEach(item => {
//                 const Region = new AV.Object('Region')
//                 const query = new AV.Query('Region')
//                 query.equalTo('code', `${item.id}00`)
//                     .find()
//                     .then(data => {
//                         if (!data[0]) {
//                             Region.set('name', item.name)
//                             Region.set('code', item.id + '00')
//                             Region.save()
//                         } else {
//                             // console.log(data[0].toJSON().code + '---' + data[0].toJSON().name + '---已经存在')
//                         }
//                     })
//             })
//         })
//     })
// }

// // 生成json文件
// const writedateRegion = () => {
//     fs.readFile('./json/region_dumps.json', 'utf-8', (err, result) => {
//         JSON.parse(result).forEach(province => {
//             // 对象   cities: [] name: 省份
//             // console.log(province)
//             // console.log('---------------------------------------------------------------')
//             if (province.name == '北京市') {
//                 province.cities.forEach(city => {
//                     // 对象 name: 市 counties: []
//                     // console.log(city)
//                     // console.log('---------------------------------------------------------------')
//                     city.counties.forEach((county, cindex) => {
//                         // 对象 name: 区 circles[]
//                         // console.log('---------------------------------------------------------------')
//                         if (county.name != '其他') {
//                             const Region = new AV.Object('Region')
//                             const query = new AV.Query('Region')
//                             query.equalTo('name', county.name)
//                                 .find()
//                                 .then(result => {
//                                     let code = result[0].toJSON().code.slice(0, 6)
//                                     county.circles.forEach((value, index) => {
//                                         index++
//                                         index = index < 10 ? '0' + index : index
//                                         if (value.name != '其他') {
//                                             fs.appendFile('./json/beijing.json', `{"name": "${value.name}","code": "${code}${index}"},`, 'utf-8')
//                                         }
//                                     })
//                                 })
//                         }
//                     })
//                 })
//             }
//         })
//     })
// }

// // 上传区域
// const updataRegion = (fileName) => {
//     fs.readFile(`./json/region/${fileName}.json`, 'utf-8', (err, result) => {
//         JSON.parse(result).forEach(region => {
//             const Region = new AV.Object('Region')
//             const query = new AV.Query('Region')
//             query.equalTo('code', region.code)
//                 .find()
//                 .then(data => {
//                     if (!data[0]) {
//                         // console.log(data)
//                         Region.set('name', region.name)
//                         Region.set('code', region.code)
//                         Region.save()
//                     } else {
//                         // console.log(data[0].toJSON().code + '---' + data[0].toJSON().name + '---已经存在')
//                     }
//                 })
//         })
//     })
// }


// // updateProvince()
// // updateCity()
// // updateArea()
// // writedateRegion()

// // updataRegion('taiwan')

// 设置默认超时时间
app.use(timeout('15s'));

// 加载云引擎中间件
app.use(AV.express());

app.enable('trust proxy');
// 需要重定向到 HTTPS 可去除下一行的注释。
// app.use(AV.Cloud.HttpsRedirect());


// 微信token认证 及前端JSSDK初始化接口
app.use('/wecahtAuth', require('./routes/wechatAuth'));
// 引导用户授权
app.use('/getAuthCode', require('./routes/getAuthCode'));
// 授权成功获取授权码Code 换取 AccessToken
app.use('/getUserInfo', require('./routes/getUserInfo'));
// 微信统一下单
app.use('/wechatUnifiedOrder', require('./routes/wechatUnifiedOrder'));
// 获取微信初始化参数
app.use('/getWechatConfig', require('./routes/getWechatConfig'));
// 微信支付成功回调
app.use('/wechatpaysuccesscallback', require('./routes/wechatpaysuccesscallback'));
// 支付宝下单
app.use('/alipayUnifiedOrder', require('./routes/alipayUnifiedOrder'));


app.use(function(req, res, next) {
    if (req.url === '/alipaypaysuccesscallback') {
        req.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(xmlparser());
app.use(cookieParser());

// 支付宝支付结果异步通知
app.use('/alipaypaysuccesscallback', require('./routes/alipaypaysuccesscallback'));

app.get('/', function(req, res) {
    res.render('index', { currentTime: new Date() });
});

// 可以将一类的路由单独保存在一个文件中
//app.use('/todos', require('./routes/todos'));

app.use(function(req, res, next) {
    // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
    if (!res.headersSent) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

// error handlers
app.use(function(err, req, res, next) {
    if (req.timedout && req.headers.upgrade === 'websocket') {
        // 忽略 websocket 的超时
        return;
    }

    const statusCode = err.status || 500;
    if (statusCode === 500) {
        console.error(err.stack || err);
    }
    if (req.timedout) {
        console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
    }
    res.status(statusCode);
    // 默认不输出异常详情
    let error = {}
    if (app.get('env') === 'development') {
        // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
        error = err;
    }
    res.render('error', {
        message: err.message,
        error: error
    });
});

module.exports = app;

// app.listen(3000, () => {
//   console.log('running....')
// })