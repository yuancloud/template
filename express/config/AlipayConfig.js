const config = require("./config.g");
module.exports = {
    appId: config.alipay_app_id,
    notifyUrl: `http://${config.lean_url}/alipaypaysuccesscallback`
};