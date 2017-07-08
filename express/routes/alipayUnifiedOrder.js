const path = require('path');
const Alipay = require('alipay-node-sdk');
const AlipayConfig = require('../config/AlipayConfig');



function getPayInfo(req, res) {
    var alipay = new Alipay({
        appId: AlipayConfig.appId,
        notifyUrl: AlipayConfig.notifyUrl,
        rsaPrivate: path.join(__dirname, '../config/rsa_private_key.pem'),
        rsaPublic: path.join(__dirname, '../config/rsa_public_key.pem'),
        sandbox: false,
        signType: 'RSA'
    });
    var payInfo = alipay.pay({
        subject: '联众同行',
        body: '联众同行',
        outTradeId: req.query.bookingNo,
        timeout: '10m',
        amount: req.query.totalFee,
        goodsType: '0'
    });
    console.log(payInfo);
    res.send({payInfo: payInfo});
}

module.exports = getPayInfo;
