/**
 * 接口汇总
 * @type {string}
 */
import config from '../../../static/json/config.g.json';
// 生产环境
// let baseURL = 'http://lz.lzhealth.com.cn/api/';
// 测试环境
//    let baseURL = 'http://lz.lianzhongtongxing.cn/api/';
const baseURL = `http://${config.lean_url}/`;
// let baseURL = 'http://oscar-zhangzs.c9users.io:8081/api/';
// let baseURL = 'http://lz.lianzhongtongxing.cn:8001/api/';
// let baseURL = 'http://oscar-lz-zhangzs.c9users.io:8081/api/';
// 本地测试
// let baseURL = 'http://lz.liugh.xyz/api/';
// 生产环境：PRODUCTION 开发环境：DEVELOP 预备环境：STAGING


let interfaceUrl = {
    // 经纬度转详细位置 坐标的类型，目前支持的坐标类型包括：bd09ll（百度经纬度坐标）、bd09mc（百度米制坐标）、gcj02ll（国测局经纬度坐标）、wgs84ll（ GPS经纬度）
    getLoactionDetail: 'http://api.map.baidu.com/geocoder/v2/?output=json&ak=Ps1WFD32jFFIIDwGvTDmTjVwW6IEYHCG&coordtype=wgs84ll',
    // 获取微信OpenId AccessToken
    getWechatUserInfo: `${baseURL}getUserInfo/`,
    // 微信SDK初始化
    getWechatConfig: `${baseURL}getWechatConfig/`,
    // 微信统一下单
    wechatUnifiedOrder: `${baseURL}wechatUnifiedOrder`,
    // 支付宝统一下单
    alipayUnifiedOrder: `${baseURL}alipayUnifiedOrder`,
    // 聚合数据 身份证验证
    identification: 'http://apis.juhe.cn/idcard/index'

};
let app = {
    url: interfaceUrl
};
export default app;
