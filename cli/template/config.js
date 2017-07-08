var common = require('./common')
var fs = require('fs')
var path = require('path')
var os = require('os')

function execute(cwd, cfgnamepre) {
    let tar = path.join(cwd, '..', 'test', 'static', 'json');
    let cfg = fs.readdirSync(path.join(cwd, '..', 'com')).find(f => f.toLowerCase().startsWith(cfgnamepre));
    if (cfg) {
        fs.writeFileSync(common.genfilelog(path.join(tar, 'config.g.json')), gen_test_config_json(JSON.parse(fs.readFileSync(path.join(cwd, '..', 'com', cfg)).toString())), 'utf-8');
        tar = path.join(cwd, '..', 'vue', 'static', 'json');
        fs.writeFileSync(common.genfilelog(path.join(tar, 'config.g.json')), gen_web_config_json(JSON.parse(fs.readFileSync(path.join(cwd, '..', 'com', cfg)).toString())), 'utf-8');
        tar = path.join(cwd, '..', 'web', 'static', 'json');
        fs.writeFileSync(common.genfilelog(path.join(tar, 'config.g.json')), gen_vue_config_json(JSON.parse(fs.readFileSync(path.join(cwd, '..', 'com', cfg)).toString())), 'utf-8');
        tar = path.join(cwd, '..', 'express', 'config');
        fs.writeFileSync(common.genfilelog(path.join(tar, 'config.g.json')), gen_express_config_json(JSON.parse(fs.readFileSync(path.join(cwd, '..', 'com', cfg)).toString())), 'utf-8');

        if (process.platform == 'win32')
            fs.writeFileSync(common.genfilelog(path.join(cwd, '..', 'd.bat')), gen_test_deploy_bat(JSON.parse(fs.readFileSync(path.join(cwd, '..', 'com', cfg)).toString()), cfg), 'utf-8');
        else if (process.platform == 'darwin')
            fs.writeFileSync(common.genfilelog(path.join(cwd, '..', 'd')), gen_test_deploy_sh(JSON.parse(fs.readFileSync(path.join(cwd, '..', 'com', cfg)).toString()), cfg), 'utf-8');
        else { console.error(process.platform); }
    }
}

function gen_test_deploy_bat(cfg, filename) {
    let str = `
call g.bat ${filename}
cd vue
call npm i --registry=https://registry.npm.taobao.org
call npm run build
cd ../web
call npm i --registry=https://registry.npm.taobao.org
call npm run build
cd ../test
call npm i --registry=https://registry.npm.taobao.org
call npm run build
cd ../express
call npm i --registry=https://registry.npm.taobao.org
call lean login -u ${cfg.lean_username} -p ${cfg.lean_password}
call lean switch --region CN --group web ${cfg.lean_app_name}
call lean deploy
cd ..
echo https://leancloud.cn/dashboard/data.html?appid=${cfg.lean_app_id}#/
echo https://${cfg.lean_url}/vue
echo https://${cfg.lean_url}/web
echo https://${cfg.lean_url}/test/#/home/init/role
echo https://${cfg.lean_url}/test/#/setting/default/index.g
echo https://${cfg.lean_url}/test/#/runall
    `
    return str
}

function gen_test_deploy_sh(cfg, filename) {
    let str = `
#!/bin/bash
. g ${filename}
cd vue
sudo npm i --registry=https://registry.npm.taobao.org
sudo npm run build
cd ../web
sudo npm i --registry=https://registry.npm.taobao.org
sudo npm run build
cd test
sudo npm i --registry=https://registry.npm.taobao.org
sudo npm run build
cd ../express
sudo npm i --registry=https://registry.npm.taobao.org
lean login -u ${cfg.lean_username} -p ${cfg.lean_password}
lean switch --region CN --group web ${cfg.lean_app_name}
lean deploy
cd ..
echo https://leancloud.cn/dashboard/data.html?appid=${cfg.lean_app_id}#/
echo https://${cfg.lean_url}/vue
echo https://${cfg.lean_url}/web
echo https://${cfg.lean_url}/test/#/home/init/role
echo https://${cfg.lean_url}/test/#/setting/default/index.g
echo https://${cfg.lean_url}/test/#/runall
`
    return str
}

function gen_test_config_json(cfg) {
    let str = `{
        "lean_app_id": "${cfg.lean_app_id}",
        "lean_app_key": "${cfg.lean_app_key}",
        "lean_phone": "${cfg.lean_phone}",
        "lean_verifiedcode": "${cfg.lean_verifiedcode}"
    }`
    return str
}

function gen_vue_config_json(cfg) {
    let str = `{
  "project_build_type_comment": "${cfg.project_build_type_comment}",
  "project_build_type": "${cfg.project_build_type}",
  "lean_url": "${cfg.lean_url}",
  "lean_app_id": "${cfg.lean_app_id}",
  "lean_app_key": "${cfg.lean_app_key}",
  "lean_debug_comment": "${cfg.lean_debug_comment}",
  "lean_debug": ${cfg.lean_debug},
  "lean_stg_comment": "${cfg.lean_stg_comment}",
  "lean_stg": ${cfg.lean_stg}
}`;
    return str
}

function gen_web_config_json(cfg) {
    let str = `{
  "project_build_type_comment": "${cfg.project_build_type_comment}",
  "project_build_type": "${cfg.project_build_type}",
  "lean_url": "${cfg.lean_url}",
  "lean_app_id": "${cfg.lean_app_id}",
  "lean_app_key": "${cfg.lean_app_key}",
  "lean_debug_comment": "${cfg.lean_debug_comment}",
  "lean_debug": ${cfg.lean_debug},
  "lean_stg_comment": "${cfg.lean_stg_comment}",
  "lean_stg": ${cfg.lean_stg}
}`;

    return str
}

function gen_express_config_json(cfg) {
    let str = `{
  "lean_app_id": "${cfg.lean_app_id}",
  "lean_app_key": "${cfg.lean_app_key}",
  "lean_master_key": "${cfg.lean_master_key}",
  "lean_url": "${cfg.lean_url}",
  "lean_debug_comment": "${cfg.lean_debug_comment}",
  "lean_debug": ${cfg.lean_debug},
  "lean_stg_comment": "${cfg.lean_stg_comment}",
  "lean_stg": ${cfg.lean_stg},
  "wx_app_id_pub_comment": "${cfg.wx_app_id_pub_comment}",
  "wx_app_id_pub": "${cfg.wx_app_id_pub}",
  "wx_app_secret_pub_comment": "${cfg.wx_app_secret_pub_comment}",
  "wx_app_secret_pub": "${cfg.wx_app_secret_pub}",
  "wx_mach_id_pub_comment": "${cfg.wx_mach_id_pub_comment}",
  "wx_mach_id_pub": "${cfg.wx_mach_id_pub}",
  "wx_mach_secret_pub_comment": "${cfg.wx_mach_secret_pub_comment}",
  "wx_mach_secret_pub": "${cfg.wx_mach_secret_pub}",
  "wx_app_id_comment": "${cfg.wx_app_id_comment}",
  "wx_app_id": "${cfg.wx_app_id}",
  "wx_app_secret_comment": "${cfg.wx_app_secret_comment}",
  "wx_app_secret": "${cfg.wx_app_secret}",
  "wx_mach_id_comment": "${cfg.wx_mach_id_comment}",
  "wx_mach_id": "${cfg.wx_mach_id}",
  "wx_mach_secret_comment": "${cfg.wx_mach_secret_comment}",
  "wx_mach_secret": "${cfg.wx_mach_secret}",
  "wx_notify_url_comment": "${cfg.wx_notify_url_comment}",
  "alipay_app_id": "${cfg.alipay_app_id}"
}`

    return str
}

module.exports.execute = execute;