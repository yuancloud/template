/**
 * Created by tangyueyang on 2017/6/8.
 */
const router = require('express').Router();
const xmlparser = require('express-xml-bodyparser');
const AV = require('leanengine');
let wechatConfig;
/**
 * 签名 key按照ASCII大小排序并拼接商户key（api秘钥）
 * @param appid
 * @returns {string}
 */
function sign(obj) {

    var string = raw1(obj);
    var key = wechatConfig.machSecret;
    string = string + '&key=' + key;
    console.log(`sign:${string}`);
    var crypto = require('crypto');
    return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
};

/**
 * key按照ASCII大小排序
 * @param args
 * @returns {string}
 */
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
 * 保存订单信息
 * @param orderInfo
 */
function saveOrderInfo(orderInfo) {
    let query = new AV.Query('Transfer');
    query.equalTo('orderno', orderInfo.out_trade_no);
    query.first().then((transfer) => {

        transfer.set('orderInfo', orderInfo);
        transfer.save().then((res) => {
            console.log('支付信息记录成功');
        }, (e) => {
            console.log('支付信息记录失败');
            console.error(e);
        });
    });

}

/**
 * 修改订单状态
 * @param orderno
 */
function updateOrderState(orderno) {
    let query = new AV.Query('Order');
    query.equalTo('orderno', orderno);
    query.first().then((order) => {
        AV.Cloud.run('Order_pay', {objectId: order.id});
    });
}

/**
 * 修改Transfer状态
 * @param orderno
 */
function updateTransferState(orderno) {
    let query = new AV.Query('Transfer');
    query.equalTo('order_orderno', orderno);
    query.first().then((transfer) => {
        transfer.set("state",2);
        transfer.save().then(function (res) {
            console.log("修改Transfer状态为2");
        }).catch(function (err) {
           console.error(err);
        });
    });
}

/**
 * 微信支付成功回调
 */
router.post('/', xmlparser({trim: false, explicitArray: false}), (req, res, next) => {

    console.log('=========微信成功回传数据==========');
    console.log(req.body);
    console.log('=================================');
    let data = req.body.xml;
    let resData;

    // 根据支付类型判断是公众号orAPP支付分别引入不同的微信配置信息
    if (data.trade_type === 'APP') {
        wechatConfig = require('../config/WechatAppConfig');
    } else if (data.trade_type === 'JSAPI') {
        wechatConfig = require('../config/WechatPubConfig');
    }
    let wechatSign = data.sign;
    delete data.sign;
    let mySign = sign(data);
    // 验证签名
    if (wechatSign === mySign) {
        resData = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
        saveOrderInfo(data);
        updateOrderState(data.out_trade_no);
        updateTransferState(data.out_trade_no);
        console.log('修改订单状态');
    } else {
        resData = '验证签名失败';
        console.log('验证签名失败');
    }

    res.type('application/xml');
    res.send(resData);
});

module.exports = router;