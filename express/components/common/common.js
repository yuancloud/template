/**
 * Created by liugh on 2017/6/7.
 */
var AV = require('leanengine');

/* 用户
 * 用户新增后事件
 * 若不存在Customer.name = user.username的数据，创建一个Customer
 * */
AV.Cloud.afterSave('_User', function(request) {
    console.log("-=-=-=-=用户新增后事件-=-=-=-=-=-=-=-==-");
    //声明：Customer
    var Customer = AV.Object.extend('Customer');
    //获取username,检查是否有关联的Customer
    var username = request.object.get('username');
    var mobilePhoneNumber = request.object.get('mobilePhoneNumber');
    if (typeof(mobilePhoneNumber) != 'undefined') {
        console.log("通过手机号注册,没有对应的Customer则创建");
        var customerQuery = new AV.Query('Customer');
        customerQuery.equalTo('username', username);
        customerQuery.count().then(function(count) {
            if (count == 0) {
                // 按用户名查找customer
                console.log("User无对应的Customer，准备新增Customer");
                var cus = new Customer();
                cus.set('code', username);
                cus.set('name', username);
                cus.set('user', request.object);
                cus.set('createdby', request.object);
                // 设置Customer的默认权限，此时Customer的hook函数无效。
                console.log("-=-=-=设置Customer的默认权限，此时Customer的hook函数无效。");
                var tbnamerole = "Customer";
                var roleQuery = new AV.Query(AV.Role);
                roleQuery.equalTo('name', tbnamerole);
                roleQuery.find()
                    .then(function(roles) {
                        if (roles.length == 0) {
                            console.log('====创建' + tbnamerole + '角色');
                            var _Role = AV.Object.extend('_Role');
                            var role = new _Role();
                            role.set('name', tbnamerole);
                            role.save().then(function(res) {
                                console.log("===将当前登录用户加入本角色");
                                var users = [request.object];
                                var relation = res.relation('users'); // 创建 AV.Relation
                                users.map(relation.add.bind(relation));
                                console.log("====创建" + tbnamerole + "角色,并设置Customer的默认权限");
                                var roleAcl = new AV.ACL();
                                roleAcl.setPublicReadAccess(true);
                                roleAcl.setPublicWriteAccess(false);
                                roleAcl.setReadAccess(request.object, true);
                                roleAcl.setWriteAccess(request.object, true);
                                roleAcl.setRoleReadAccess(res, true);
                                roleAcl.setRoleWriteAccess(res, true);
                                cus.setACL(roleAcl);
                            }).catch(function(err) {
                                console.error(err);
                            });
                        } else {
                            console.log("====存在" + tbnamerole + "角色，设置档案的默认权限");
                            var roleAcl = new AV.ACL();
                            console.log("====1111");
                            roleAcl.setPublicReadAccess(true);
                            roleAcl.setPublicWriteAccess(false);
                            console.log("====2222");
                            roleAcl.setReadAccess(request.object, true);
                            roleAcl.setWriteAccess(request.object, true);
                            console.log("====3333");
                            roleAcl.setRoleReadAccess(roles[0], true);
                            roleAcl.setRoleWriteAccess(roles[0], true);
                            console.log("====4444");
                            cus.setACL(roleAcl);
                            console.log("====5555");
                        }
                    });
                //
                cus.save().then(function(result) {
                    console.log("======Customer创建完成");
                }).catch(function(err) {
                    console.error(err);
                });
            } else {
                console.log("User对应的Customer已存在");
            }
        }).catch(function(err) {
            console.error(err);
        });
    } else {
        console.log("非手机号注册，不处理Customer");
    }
});
// file新增后事件
AV.Cloud.afterSave('_File', function(request) {
    console.log("-=-=-=-=File新增后事件(暂注释)-=-=-=-=-=-=-=-==-");
    console.log("-=-=-=-=-=-=-=-=-=-=-=-==-");
});

//短信验证成功
AV.Cloud.onVerified('sms', function(request) {
    console.log("-=-=-=-=onVerified函数-=-=-=-=-=-=-=-==-");
    //声明：Customer
    var Customer = AV.Object.extend('Customer');
    //获取username,检查是否有关联的Customer
    var username = request.object.get('username');
    var mobilePhoneNumber = request.object.get('mobilePhoneNumber');
    if (typeof(mobilePhoneNumber) != 'undefined') {
        console.log("通过手机号注册,没有对应的Customer则创建");
        var customerQuery = new AV.Query('Customer');
        customerQuery.equalTo('username', username);
        customerQuery.count().then(function(count) {
            if (count == 0) {
                // 按用户名查找customer
                console.log("User无对应的Customer，准备新增Customer");
                var cus = new Customer();
                cus.set('code', username);
                cus.set('name', username);
                cus.set('user', request.object);
                cus.set('createdby', request.object);
                // 设置Customer的默认权限，此时Customer的hook函数无效。
                console.log("-=-=-=设置Customer的默认权限，此时Customer的hook函数无效。");
                var tbnamerole = "Customer";
                var roleQuery = new AV.Query(AV.Role);
                roleQuery.equalTo('name', tbnamerole);
                roleQuery.find()
                    .then(function(roles) {
                        if (roles.length == 0) {
                            console.log('====创建' + tbnamerole + '角色');
                            var _Role = AV.Object.extend('_Role');
                            var role = new _Role();
                            role.set('name', tbnamerole);
                            role.save().then(function(res) {
                                console.log("===将当前登录用户加入本角色");
                                var users = [request.object];
                                var relation = res.relation('users'); // 创建 AV.Relation
                                users.map(relation.add.bind(relation));
                                console.log("====创建" + tbnamerole + "角色,并设置Customer的默认权限");
                                var roleAcl = new AV.ACL();
                                roleAcl.setPublicReadAccess(true);
                                roleAcl.setPublicWriteAccess(false);
                                roleAcl.setReadAccess(request.object, true);
                                roleAcl.setWriteAccess(request.object, true);
                                roleAcl.setRoleReadAccess(res, true);
                                roleAcl.setRoleWriteAccess(res, true);
                                cus.setACL(roleAcl);
                            }).catch(function(err) {
                                console.error(err);
                            });
                        } else {
                            console.log("====存在" + tbnamerole + "角色，设置档案的默认权限");
                            var roleAcl = new AV.ACL();
                            console.log("====1111");
                            roleAcl.setPublicReadAccess(true);
                            roleAcl.setPublicWriteAccess(false);
                            console.log("====2222");
                            roleAcl.setReadAccess(request.object, true);
                            roleAcl.setWriteAccess(request.object, true);
                            console.log("====3333");
                            roleAcl.setRoleReadAccess(roles[0], true);
                            roleAcl.setRoleWriteAccess(roles[0], true);
                            console.log("====4444");
                            cus.setACL(roleAcl);
                            console.log("====5555");
                        }
                    });
                //
                cus.save().then(function(result) {
                    console.log("======Customer创建完成");
                }).catch(function(err) {
                    console.error(err);
                });
            } else {
                console.log("User对应的Customer已存在");
            }
        }).catch(function(err) {
            console.error(err);
        });
    } else {
        console.log("非手机号注册，不处理Customer");
    }
});
//绑定手机号
AV.Cloud.define('bindMobile', function(request) {;
    // console.log(request);
    console.log("====第三方登录绑定手机号");
    console.log(request.params.objectId);
    console.log(request.params.phoneNum);
    var Customer = AV.Object.extend('Customer');
    var user_obectId = request.params.objectId;
    var phoneNum = request.params.phoneNum;
    var userQuery = new AV.Query(AV.User);
    userQuery.get(user_obectId).then((user) => {
        user.setMobilePhoneNumber(phoneNum);
        user.set('mobilePhoneVerified', true);
        user.set('username', phoneNum);
        user.save().then(function(res) {
            console.log("====创建对应的Customer");
            var customerQuery = new AV.Query('Customer');
            customerQuery.equalTo('username', phoneNum);
            customerQuery.count().then(function(count) {
                if (count == 0) {
                    // 按用户名查找customer
                    console.log("====User无对应的Customer，准备新增Customer");
                    var cus = new Customer();
                    cus.set('code', phoneNum);
                    cus.set('name', phoneNum);
                    cus.set('user', user);
                    cus.set('createdby', user);
                    cus.save().then(function(result) {
                        console.log("======Customer创建完成");
                    }).catch(function(err) {
                        console.error(err);
                    });
                } else {
                    console.log("User对应的Customer已存在");
                }
            }).catch(function(err) {
                console.error(err);
            });
        }).catch(function(err) {
            console.error(err);
        });
    });

});

//余额支付更新订单状态
AV.Cloud.define('accountPay',function (request) {
    console.log("====余额支付后更新transfer以及Order状态");
    console.log(request.params.orderId);
    var orderId =  request.params.orderId;
    var orderQuery = new AV.Query("Order");
    orderQuery.get(orderId).then(function (currentOrder) {
        var transferQuery = new AV.Query("Transfer");
        transferQuery.equalTo("order",currentOrder);
        transferQuery.find().then(function (transfers) {
            transfers[0].set("state",2);
            transfers[0].save().then(function (transfer) {
                console.log("====Transfer状态更新完成（2）");
                currentOrder.set('state',2);
                currentOrder.save().then(function (res) {
                    console.log("====Order状态更新完成（2）");
                }).catch(function (err) {
                    console.error(err);
                });
            }).catch(function (err) {
                console.error(err);
            });
        }).catch(function (err) {
            console.error(err);
        });
    }).catch(function (err) {
        console.error(err);
    });
});

// 通过用户ID获取会员余额
AV.Cloud.define('getBalance',function (request) {
    console.log("====通过用户ID获取账户余额");
    console.log(request.params.userId);
    var userId = request.params.userId;
    var cql = 'select * from Transfer where createdby=pointer("_User",?) and categoryType = ? and state = ?';
    console.log(cql);
    var pvalues = [userId,6,2];
    console.log(pvalues);
    return AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
        console.log("====准备获取充值总额度");
        // console.log(data);
        var results = data.results;
        // console.log(results);
        var czTotalPrice = 0 ; //该用户的充值总金额
        for(var i in results){
            czTotalPrice = czTotalPrice + results[i].get("totalPrice");
        }
        var xfTotalPrice = 0 ; //该用户的消费总金额
        cql = 'select * from Transfer where createdby=pointer("_User",?) and payType = ?  and state = ? ';
        pvalues = [userId,'balance',2];
        return AV.Query.doCloudQuery(cql, pvalues).then(function (data) {
            var xf_results = data.results;
            for(var i in xf_results){
                xfTotalPrice = xfTotalPrice + xf_results[i].get("totalPrice");
            }
            //返回值
            console.log(czTotalPrice);
            console.log(xfTotalPrice);
            console.log("==返回结果");
            var result = (czTotalPrice - xfTotalPrice).toFixed(2);
            console.log(result);
            // return balance;
            return {
                balance:result
            };

        }).catch(function (err) {
           console.error(err);
        });
    }).catch(function (err) {
        console.error(err);
    });
});
//通过用户ID获取会员余额及交易明细
AV.Cloud.define('getBalanceAndTransfers',function (request) {
    console.log("====通过用户ID获取会员余额及交易明细");
    var userId = request.params.userId;
    console.log(userId);
    var userQuery = new AV.Query('_User');
    return userQuery.get(userId).then(function (user) {
        //充值部分
        var transferQuery = new AV.Query('Transfer');
        transferQuery.equalTo("createdby",user);
        transferQuery.equalTo("state",2);
        transferQuery.equalTo("categoryType",6);
        transferQuery.include("order");
        //交易部分
        var xf_transferQuery = new AV.Query('Transfer');
        xf_transferQuery.equalTo("createdby",user);
        xf_transferQuery.equalTo("state",2);
        xf_transferQuery.equalTo("payType","balance");
        xf_transferQuery.include("order");

        var czTotalPrice = 0 ; //该用户的充值总金额
        var xfTotalPrice = 0 ; //该用户的消费总金额
        var transferArr = []; //交易明细数据
        var query = AV.Query.or(transferQuery, xf_transferQuery);
        return query.find().then(function (transfers) {
            for(var i in transfers){
                var totalPrice = transfers[i].get("totalPrice");
                var categoryType = transfers[i].get("categoryType");
                var item_name = transfers[i].get("orderno");
                if(categoryType == 6 ){
                    czTotalPrice = czTotalPrice + totalPrice;
                    item_name = "充值";
                }
                var payType = transfers[i].get("payType");
                if(payType == "balance" ){
                    xfTotalPrice = xfTotalPrice + totalPrice;
                    item_name = "消费";
                }
                var transferDate = transfers[i].get("updatedAt"); //交易日期
                transferArr.push({"item_name":item_name,"updatedAt":transferDate,"totalPrice":totalPrice});
            }
            var balance = (czTotalPrice - xfTotalPrice).toFixed(2);
            console.log({"balance":balance,"transfers":transferArr});
            return {"balance":balance,"transfers":transferArr};
        }).catch(function (err) {
            console.error(err);
        })
    });
});

module.exports = AV.Cloud;