import app from './app';
import axios from 'axios';
/**
 * 初始化微信JS SDK
 */
export function initWechatSDK() {
  let params = {
    params: {
      url: window.location.href.split('#')[0]
    }
  };
  axios.get(app.url.wechatConfig, params).then((res) => {
    res = res.data;
    window.wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'wx7e46bf986e1e25fd', // 必填，公众号的唯一标识
      timestamp: res.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.nonceStr, // 必填，生成签名的随机串
      signature: res.signature, // 必填，签名，见附录1
      jsApiList: ['chooseWXPay', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    window.wx.ready(function () {
      // alert('init wechat success');
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      console.log('wechat sdk init success');
    });
    window.wx.error(function (res) {
      alert(JSON.stringify(res));
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      console.log('wechat sdk init success');
    });
    window.wx.scanQRCode({
      needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        console.log(result);
      }
    });
    // window.wx.getLocation({
    //   type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    //   success: function (res) {
    //     alert(res.latitude);
    //     console.log(res);
    //   }
    // });
  });
}

/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};
/**
 * 设置缓存
 * @param key
 * @param value
 */
export function setStorage(key, value) {
  if (!key || !value) {
    console.log('setStorage参数为空');
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}
/**
 * 获取缓存
 * @param key
 */
export function getStorage(key) {
  if (!key) {
    console.log('getStorage参数为空');
  }
  if (!window.localStorage.getItem(key)) {
    return window.localStorage.getItem(key);
  } else {
    return JSON.parse(window.localStorage.getItem(key));
  }
}
/**
 * 移除缓存
 * @param key
 */
export function removeStorage(key) {
  if (!key) {
    console.log('removeStorage参数为空');
  }
  window.localStorage.removeItem(key);
}
/**
 * 校验手机号
 * @param phoneNum
 */
export function checkPhoneNum(phoneNum) {
  let isPhoneNum = false;
  if (phoneNum) {
    var reg = /^1[34578]\d{9}$/;
    isPhoneNum = reg.test(phoneNum);
  } else {
    window.alert('手机号参数不能为空!');
  }
  return isPhoneNum;
}

/**
 * 获取url参数
 * @param name
 * @returns {null}
 * @constructor
 */
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

/**
 * 获取全国省市地址
 */
export function getAddress() {
  const address = {
    '北京': ['北京'],
    '广东': ['广州', '深圳', '珠海', '汕头', '韶关', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
    '上海': ['上海'],
    '天津': ['天津'],
    '重庆': ['重庆'],
    '辽宁': ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'],
    '江苏': ['南京', '苏州', '无锡', '常州', '镇江', '南通', '泰州', '扬州', '盐城', '连云港', '徐州', '淮安', '宿迁'],
    '湖北': ['武汉', '黄石', '十堰', '荆州', '宜昌', '襄樊', '鄂州', '荆门', '孝感', '黄冈', '咸宁', '随州', '恩施土家族苗族自治州', '仙桃', '天门', '潜江', '神农架林区'],
    '四川': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
    '陕西': ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'],
    '河北': ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'],
    '山西': ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'],
    '河南': ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店'],
    '吉林': ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边朝鲜族自治州'],
    '黑龙江': ['哈尔滨', '齐齐哈尔', '鹤岗', '双鸭山', '鸡西', '大庆', '伊春', '牡丹江', '佳木斯', '七台河', '黑河', '绥化', '大兴安岭地区'],
    '内蒙古': ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '锡林郭勒盟', '兴安盟', '阿拉善盟'],
    '山东': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '莱芜', '临沂', '德州', '聊城', '滨州', '菏泽'],
    '安徽': ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '巢湖', '六安', '亳州', '池州', '宣城'],
    '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
    '福建': ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'],
    '湖南': ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西土家族苗族自治州'],
    '广西': ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'],
    '江西': ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'],
    '贵州': ['贵阳', '六盘水', '遵义', '安顺', '铜仁地区', '毕节地区', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
    '云南': ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州', '大理白族自治州', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州'],
    '西藏': ['拉萨', '那曲地区', '昌都地区', '林芝地区', '山南地区', '日喀则地区', '阿里地区'],
    '海南': ['海口', '三亚', '五指山', '琼海', '儋州', '文昌', '万宁', '东方', '澄迈县', '定安县', '屯昌县', '临高县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县'],
    '甘肃': ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '酒泉', '张掖', '庆阳', '平凉', '定西', '陇南', '临夏回族自治州', '甘南藏族自治州'],
    '宁夏': ['银川', '石嘴山', '吴忠', '固原', '中卫'],
    '青海': ['西宁', '海东地区', '海北藏族自治州', '海南藏族自治州', '黄南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
    '新疆': ['乌鲁木齐', '克拉玛依', '吐鲁番地区', '哈密地区', '和田地区', '阿克苏地区', '喀什地区', '克孜勒苏柯尔克孜自治州', '巴音郭楞蒙古自治州', '昌吉回族自治州', '博尔塔拉蒙古自治州', '石河子', '阿拉尔', '图木舒克', '五家渠', '伊犁哈萨克自治州'],
    '香港': ['香港'],
    '澳门': ['澳门'],
    '台湾': ['台北市', '高雄市', '台北县', '桃园县', '新竹县', '苗栗县', '台中县', '彰化县', '南投县', '云林县', '嘉义县', '台南县', '高雄县', '屏东县', '宜兰县', '花莲县', '台东县', '澎湖县', '基隆市', '新竹市', '台中市', '嘉义市', '台南市']
  };
  return address;
}

/**
 * [uploadFile 图片上传]
 * @param  {[element]} img     [要设置图片target节点]
 * @param  {[function]} excute     [回掉]
 * @return {[type]}         [description]
 */
export function uploadImg(img, excute) {
  if (!img) {
    console.log('参数为空');
    return;
  }
  if (typeof (excute) !== 'function') {
    console.log('回调方法类型错误');
    return;
  }
  let imgFile, element;
  // let img = document.createElement('img');
  if (!imgFile) {
    imgFile = new FileReader();
  }

  if (!element) {
    element = document.createElement('input');
    element.type = 'file';
  }

  element.click();
  element.onchange = (event) => {
    imgFile.readAsDataURL(element.files[0]);
    imgFile.onload = function () {
      // this.result为base64数据
      img.src = this.result;
      excute(this.result, element);
    };
  };
}
/**
 * 两个参数，一个是cookie的名子，一个是值
 * @param name
 * @param value
 * @constructor
 */
export function setCookie(name, value) {
  var Days = 30; // 此 cookie 将被保存 30 天
  var exp = new Date();    // new Date("December 31, 9998");
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
}
/**
 * 取cookies函数
 * @param name
 * @returns {null}
 */
export function getCookie(name) {
  var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
  if (arr != null) return unescape(arr[2]);
  return null;
}
/**
 * 删除cookie
 * @param name
 */
export function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
}
/**
 * 获取当前日期YY-MM-DD
 */
export function getDate() {
  let date = new Date();
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
}
/**
 * 获取当前日期hh-mm-ss
 */
export function getTime() {
  let date = new Date();
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
/**
 * 获取当前经纬度
 * @param successCallback 成功回调
 * @param errorCallback 失败回调
 */
export function getLocation(successCallback, errorCallback) {
  let params = {latitude: '', longitude: ''};
  switch (window.buildType) {
    case 'web':
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          params.latitude = position.coords.latitude;
          params.longitude = position.coords.longitude;
          successCallback(params);
        });
      } else {
        errorCallback(new Error().message = '浏览器不支持定位!');
      }
      break;
    case 'wx':
      window.wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: successCallback()
        // success: function (res) {
        //   var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        //   var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        //   var speed = res.speed; // 速度，以米/每秒计
        //   var accuracy = res.accuracy; // 位置精度
        // }
      });
      break;
    case 'app':
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          params.latitude = position.coords.latitude;
          params.longitude = position.coords.longitude;
          successCallback(params);
        }, errorCallback);
      }
      break;
    default:
      break;
  }
}

/**
 * 跨域
 * @param url
 * @param callbackName 回调方法名
 * @param callback 回调方法
 * @constructor
 */
export function JSONP(url, callbackName, callback) {
  let script = document.createElement('script');
  script.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(script);
  window[callbackName] = callback;
}
