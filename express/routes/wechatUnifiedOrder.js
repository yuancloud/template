/**
 * Created by tangyueyang on 2017/5/18.
 */
const router = require('express').Router();
let wechatConfig;
const request = require('request');

/**
 * 签名加密
 * @param appid
 * @param attach
 * @param body
 * @param mch_id
 * @param nonce_str
 * @param notify_url
 * @param openid
 * @param out_trade_no
 * @param spbill_create_ip
 * @param total_fee
 * @param trade_type
 */
function paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
    var ret = {
        appid: appid,
        // attach: attach,
        body: body,
        mch_id: mch_id,
        nonce_str: nonce_str,
        notify_url: notify_url,
        // openid: openid,
        out_trade_no: out_trade_no,
        spbill_create_ip: spbill_create_ip,
        total_fee: total_fee,
        trade_type: trade_type
    };
    if (openid) {
        ret.openid = openid;
    }
    console.log('=========签名参数=========');
    console.log(ret);
    console.log('=========================');

    var string = raw1(ret);
    var key = wechatConfig.machSecret;
    string = string + '&key=' + key;
    console.log(`sign:${string}`);
    var crypto = require('crypto');
    return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
};

/**
 * 签名
 * @param appid
 * @param nonceStr
 * @param package
 * @param signType
 * @param timeStamp
 */
function paysignjs(appid, nonceStr, package, signType, timeStamp) {
    var ret = {
        appId: appid,
        nonceStr: nonceStr,
        package: package,
        signType: signType,
        timeStamp: timeStamp
    };
    var string = raw1(ret);
    var key = wechatConfig.machSecret;
    string = string + '&key=' + key;
    console.log('=============二次签名==========');
    console.log(string);
    console.log('==============================');
    var crypto = require('crypto');
    return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
};

/**
 * 微信app签名
 * @param appid
 * @param nonceStr
 * @param package
 * @param timeStamp
 */
function appPaysign(nonceStr, prepayid, timeStamp) {
    var ret = {
        appid: wechatConfig.appId,
        partnerid: wechatConfig.machId,
        prepayid: prepayid,
        noncestr: nonceStr,
        package: 'Sign=WXPay',
        timestamp: timeStamp
    };
    var string = raw1(ret);
    var key = wechatConfig.machSecret;
    string = string + '&key=' + key;
    console.log('=============二次签名==========');
    console.log(string);
    console.log('==============================');
    var crypto = require('crypto');
    return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
};


function raw1(args) {
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
 * 解析XML
 * @param node_name
 * @param xml
 * @returns {*}
 */
function getXMLNodeValue(node_name, xml) {
    var tmp = xml.split('<' + node_name + '>');
    var _tmp = tmp[1].split('</' + node_name + '>');
    return _tmp[0];
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
router.get('/', (req, res, next) => {
    console.log('==========微信下单参数==========');
    console.log(req.query);
    console.log('==============================');
    var trade_type;
    if (req.query.payType === 'wx') {
        openid = req.query.openId;
        trade_type = 'JSAPI';
        wechatConfig = require('../config/WechatPubConfig');
    } else if (req.query.payType === 'app') {
        openid = '';
        trade_type = 'APP';
        wechatConfig = require('../config/WechatAppConfig');
    }
    var bookingNo = req.query.bookingNo;
    var appid = wechatConfig.appId;
    var attach = '联众同行';
    var mch_id = wechatConfig.machId;
    var nonce_str = randomString();
    var total_fee = req.query.totalFee;
    var notify_url = wechatConfig.notifyUrl;
    var openid;
    var body = req.query.body;
    var msTimeStamp = Date.parse(new Date()).toString();
    var timeStamp = msTimeStamp.substring(0, msTimeStamp.length - 3);
    var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    var formData = '<xml>';
    formData += '<appid>' + wechatConfig.appId + '</appid>';  // appid
    // formData += '<attach>' + attach + '</attach>'; // 附加数据
    formData += '<body>' + body + '</body>';
    formData += '<mch_id>' + wechatConfig.machId + '</mch_id>';  // 商户号
    formData += '<nonce_str>' + nonce_str + '</nonce_str>'; // 随机字符串，不长于32位。
    formData += '<notify_url>' + notify_url + '</notify_url>';
    formData += '<out_trade_no>' + bookingNo + '</out_trade_no>';
    formData += '<spbill_create_ip>192.168.1.1</spbill_create_ip>';
    formData += '<total_fee>' + total_fee + '</total_fee>';
    if (req.query.payType === 'wx') {
        formData += '<trade_type>JSAPI</trade_type>';
        formData += '<openid>' + openid + '</openid>';
    } else if (req.query.payType === 'app') {
        formData += '<trade_type>APP</trade_type>';
    }
    formData += '<sign>' + paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, openid, bookingNo, '192.168.1.1', total_fee, trade_type) + '</sign>';
    formData += '</xml>';
    console.log('=========统一下单参数=========');
    console.log(formData);
    console.log('============================')
    request({url: url, method: 'POST', body: formData}, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            console.log(body);
            var prepay_id = getXMLNodeValue('prepay_id', body.toString('utf-8'));
            var tmp = prepay_id.split('[');
            var tmp1 = tmp[2].split(']');
            //签名
            var _paySignjs = paysignjs(appid, nonce_str, 'prepay_id=' + tmp1[0], 'MD5', timeStamp);
            let data = {
                timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: nonce_str, // 支付签名随机串，不长于 32 位
                package: 'prepay_id=' + tmp1[0], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: _paySignjs // 支付签名
            }
            if (req.query.payType === 'app') {
                data = {
                    partnerid: wechatConfig.machId, // merchant id
                    prepayid: tmp1[0], // prepay id
                    noncestr: nonce_str, // nonce
                    timestamp: timeStamp, // timestamp
                    sign: appPaysign(nonce_str, tmp1[0], timeStamp) // signed string
                }
            }
            console.log('==========最终参数=========');
            console.log(data);
            console.log('==========================');
            res.send(data);
            //res.send({prepay_id: tmp1[0], _paySignjs: _paySignjs});
            //res.render('jsapipay',{rows:body});
            //res.redirect(tmp3[0]);
        }
    });
});
module.exports = router;