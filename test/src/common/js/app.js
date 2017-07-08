/**
 * 接口汇总
 * @type {string}
 */
// 生产环境
// let baseURL = 'http://lz.lzhealth.com.cn/api/';
// 测试环境
   let baseURL = 'http://lz.lianzhongtongxing.cn/api/';
// let baseURL = 'http://oscar-zhangzs.c9users.io:8081/api/';
// let baseURL = 'http://lz.lianzhongtongxing.cn:8001/api/';
// let baseURL = 'http://oscar-lz-zhangzs.c9users.io:8081/api/';
// 本地测试
// let baseURL = 'http://lz.liugh.xyz/api/';
let interfaceUrl = {
  // 经纬度转详细位置 坐标的类型，目前支持的坐标类型包括：bd09ll（百度经纬度坐标）、bd09mc（百度米制坐标）、gcj02ll（国测局经纬度坐标）、wgs84ll（ GPS经纬度）
  getLoactionDetail: 'http://api.map.baidu.com/geocoder/v2/?output=json&ak=Ps1WFD32jFFIIDwGvTDmTjVwW6IEYHCG&coordtype=wgs84ll',
  // 微信SDK初始化
  wechatConfig: `${baseURL}jsapi/`,
  // 获取微信OpenId AccessToken
  getWechatUserInfo: `${baseURL}GetWXAccessTockenInfo/`,
  // 登录
  login: `${baseURL}jslogin/`,
  // 验证码
  verifyCode: `${baseURL}sms/`,
  // 注册
  register: `${baseURL}register/`,
  // 广告图
  ads: `${baseURL}ads/`,
  // 模块列表
  modules: `${baseURL}categories/`,
  // 商品搜索
  productSearch: `${baseURL}product-search/`,
  // 商品详情
  products: `${baseURL}products/`,
  // 我的订单
  order: `${baseURL}orders/`,
  // 发现
  featured: `${baseURL}filter/`,
  // 发现－旺店
  bestSeller: `${baseURL}best-sellers`,
  // 发现－热评榜
  hotComment: `${baseURL}most-reviewed-products`,
  // 发现－健康优选
  healthChoose: `${baseURL}featured/`,
  // 发现－新店入驻
  newStore: `${baseURL}partners/`,
  // 店铺详情
  storeDetail: `${baseURL}partners/`,
  // 店铺－－收藏
  addCollect: `${baseURL}partner-wishlist/`,
  // 推荐店铺
  recommendStore: `${baseURL}partners/`,
  // 店内商品
  storeGoods: `${baseURL}partners/`,
  // 会员卡充值量
  topUpCards: `${baseURL}top-up-cards/`,
  // 确定支付
  topUp: `${baseURL}top-up/`,
  // 分页api
  partners: `${baseURL}partners/`,
  // 修改个人信息点击完成http://lz.lzhealth.com.cn/api/profile/
  profile: `${baseURL}profile/`,
  // 猜你喜欢（商品服务推荐）
  recommend: `${baseURL}featured/`,
  // 购物车
  shopcart: `${baseURL}basket-lines_v2/`,
  // 加入购物车
  addToShopcart: `${baseURL}basket-add-product/`,
  // 查找个人信息
  users: `${baseURL}users/`,
  // 会员卡信息
  account: `${baseURL}account/`,
  // 立即支付
  immediatePayment: `${baseURL}immediately-checkout/`,
  // 提交订单
  placeOrder: `${baseURL}checkoutV2/`,
  // 预约服务
  servicePlaceOrder: `${baseURL}immediately-checkout/`,
  // 七牛
  qiniu: `${baseURL}qiniu-token/`,
  // 商品收藏
  collectGoods: `${baseURL}wishlist/`,
  // 店铺收藏
  collectStore: `${baseURL}partner-wishlist/`,
  // 地址
  address: `${baseURL}addresses/`,
  // 地区列表
  districts: `${baseURL}districts/`
};
let app = {
  url: interfaceUrl
};
export default app;
