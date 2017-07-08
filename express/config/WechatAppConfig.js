const config = require("./config.g");
module.exports = {
    'appId': config.wx_app_id, // 配置里的appid
    'appSecret': config.wx_app_secret, // 配置中的appsecret
    'machId': config.wx_mach_id, // 微信商户平台的商户ID
    'machSecret': config.wx_mach_secret,
    'notifyUrl': `https://${config.lean_url}/wechatpaysuccesscallback`
}