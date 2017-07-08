const request = require('request');
const qs = require('querystring');
const config = require('../config/WechatPubConfig');

/**
 * Code换取AccessToken
 * @param {*} code
 */
function getToken(code) {
    // console.log(code);
    // 微信获取AccessToken请求地址
    let reqUrl = 'https://api.weixin.qq.com/cgi-bin/token?';
    let params = {
        appid: config.appId,
        secret: config.appSecret,
        grant_type: 'client_credential'
    };
    let options = {
        method: 'GET',
        url: reqUrl + qs.stringify(params)
    };
    // console.log(JSON.stringify(options));
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (res.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(err);
            }
        })
    });
}

/**
 * 生成随机字符
 * @param len 随机字符长度 默认32
 * @returns {string}
 */
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

/**
 * 获取JSAPI_Ticket
 * @param accessToken
 * @returns {Promise}
 */
function getTicket(accessToken) {
    let reqUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
    // console.log('=====reqUrl====');
    // console.log(reqUrl);
    let options = {
        method: 'GET',
        url: reqUrl
    };
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (res.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(err);
            }
        });
    });

}

/**
 * 签名
 * @param ticket
 * @param url
 */
function sign(ticket, url) {
    let msTimestamp = Date.parse(new Date()).toString();
    let noncestr = randomString();
    let timestamp = msTimestamp.substring(0, msTimestamp.length-3);
    let data = {
        noncestr: noncestr,
        jsapi_ticket: ticket,
        timestamp: timestamp,
        url: url
    }
    // console.log('======签名数据======');
    // console.log(data);
    // console.log('===================');
    let string = raw(data);
    // console.log(string);
    var crypto = require('crypto');
    let newData = {
        appId: config.appId,
        nonceStr: noncestr,
        timestamp: timestamp
    }
    newData.signature = crypto.createHash('sha1').update(string, 'utf8').digest('hex');
    return newData;
}

/**
 * 按key ascii字典排序
 * @param args
 * @returns {string}
 */
function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key] = args[key];
    });
    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

/**
 * 入口函数
 */
function run(req, res, next) {
    let url = req.query.url;
    let response = res;
    getToken().then((res) => {
        getTicket(res.access_token).then((res) => {
            response.send(sign(res.ticket, url));
        });
    });

}

module.exports = run;