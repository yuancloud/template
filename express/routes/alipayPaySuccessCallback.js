const Alipay = require('alipay-node-sdk');
const AlipayConfig = require('../config/AlipayConfig');
const path = require('path');
const AV = require('leanengine');
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
 * 验签
 * @param req
 * @param res
 */
function verifySign(req, res) {
    console.log(req.body)
    let data = req.body;

    let alipay = new Alipay({
        appId: AlipayConfig.appId,
        notifyUrl: AlipayConfig.notifyUrl,
        rsaPrivate: path.join(__dirname, '../config/rsa_private_key.pem'),
        rsaPublic: path.join(__dirname, '../config/rsa_public_key.pem'),
        sandbox: false,
        signType: 'RSA'
    });

    let ok = alipay.signVerify(data);

    if (ok) {
        saveOrderInfo(data);
        updateOrderState(data.out_trade_no);
        updateTransferState(data.out_trade_no);
        console.log('支付宝成功回调验证签名成功');
        res.send('success');
    } else {
        console.error('支付宝成功回调验证签名失败');
    }
}
module.exports = verifySign;