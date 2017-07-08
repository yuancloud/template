var router = require('express').Router();
var config = require('../config/WechatPubConfig');

router.get('/', (req, res, next) => {
    var currentUrl = req.query.currentUrl;
    var redirectUri = req.query.redirectUri;
    var authUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+config.appId+'&redirect_uri='+redirectUri+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    var response = {
      authUrl: authUrl
    };
    res.redirect(authUrl);
    // res.send(authUrl);
});
module.exports = router;