'use strict';
const request = require('request');
const qs = require('querystring');
const config = require('../config/WechatPubConfig');

/**
 * Code换取AccessToken
 * @param {*} code 
 */
function getToken(code) {
  console.log(code);
  // 微信获取AccessToken请求地址
  let reqUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
  let params = {
    appid: config.appId,
    secret: config.appSecret,
    code: code,
    grant_type: 'authorization_code'
  };
  let options = {
    method: 'get',
    url: reqUrl + qs.stringify(params)
  };
  console.log(JSON.stringify(options));
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (res.statusCode == 200) {
        resolve(body);
      } else {
        reject(err);
      }
    })
  });
}

/**
 * 通过AccessToken获取用户信息
 * @param {*} accessToken 
 */
function getUserInfo(accessToken, openId) {
  let reqUrl = 'https://api.weixin.qq.com/sns/userinfo?';
  let params = {
    access_token: accessToken,
    openid: openId,
    lang: 'zh_CN'
  };
  let options = {
    method: 'get',
    url: reqUrl + qs.stringify(params)
  };
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      let data = JSON.parse(body);
      if (accessToken) {
        data.accessToken = accessToken;
      }
      if (res.statusCode == 200) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

/**
 * 入口函数
 * @param {*} req 
 * @param {*} res 
 */
function run(req, res, next) {
  getToken(req.query.code)
    .then((data) => {
      console.log('success');
      return JSON.parse(data);
    }, (e) => {
      res.send('getToken error' + JSON.stringify(e));
      next();
    })
    .then((data) => {
      console.log('data' + JSON.stringify(data));
      getUserInfo(data.access_token, data.openid).then((userInfo) => {
        console.log('=================')
        console.log(userInfo)
        console.log('=================')
        res.send(userInfo);
      })
    }, (e) => {
      res.send('getUserInfo' + JSON.stringify(e));
      next();
    });
}

module.exports = run;