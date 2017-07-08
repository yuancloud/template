// 生产环境：PRODUCTION 开发环境：DEVELOP 预备环境：STAGE
// let params;
// switch (global.runtimeType) {
//     case 'PRODUCTION':
//         // 公众号：联众同行
//         params = {
//             'token': 'lzzptogether', // 配置中的token
//             'appId': 'wx7e46bf986e1e25fd', // 配置里的appid
//             'appSecret': 'f47171232cfc697bac6e8288111e88a3', // 配置中的appsecret
//             'machId': '1449239302', // 微信商户平台的商户ID
//             'machSecret': '1ZAqhmo5LzbhdwAU46h6ftC5DExPCXgO',
//             'notifyUrl': 'https://lztogether.leanapp.cn/paySuccessCallback'
//         };
//         break;
//     case 'STAGING':
//         // 公众号：联众同行
//         params = {
//             'token': 'lzzptogether', // 配置中的token
//             'appId': 'wx7e46bf986e1e25fd', // 配置里的appid
//             'appSecret': 'f47171232cfc697bac6e8288111e88a3', // 配置中的appsecret
//             'machId': '1449239302', // 微信商户平台的商户ID
//             'machSecret': '1ZAqhmo5LzbhdwAU46h6ftC5DExPCXgO',
//             'notifyUrl': 'https://lztogether.leanapp.cn/paySuccessCallback'
//         };
//         break;
//     case 'DEVELOP':
//         // 测试公众号：unknown
//         params = {
//             'token': 'lzzptogether', // 配置中的token
//             'appId': 'wx2f85acc5c9bc52d5', // 配置里的appid
//             'appSecret': '8d25d8d1db47c4a87a193400f42a814e', // 配置中的appsecret
//             'machId': '1289187701', // 微信商户平台的商户ID
//             'machSecret': '784b6DAC8R6d810057ddeff15752AE7C',
//             'notifyUrl': 'https://lztogethertest.leanapp.cn/paySuccessCallback'
//         };
//         break;
//     default:
//         break;
// }
const config = require("./config.g");
module.exports = {
    'token': config.wx_token, // 配置中的token
    'appId': config.wx_app_id_pub, // 配置里的appid
    'appSecret': config.wx_app_secret_pub, // 配置中的appsecret
    'machId': config.wx_mach_id_pub, // 微信商户平台的商户ID
    'machSecret': config.wx_mach_secret_pub,
    'notifyUrl': `https://${config.lean_url}/wechatpaysuccesscallback`
};