var AV = require('leanengine');
//设置创建人，afterSave调用
module.exports.setCreatedBy = function(request) {
    request.object.set("createdby", request.user);
}
    //设置修改人,afterUpdate时调用
module.exports.setUpdatedBy = function(request) {
    request.object.set("updatedby", request.user);
}

module.exports.setDefaultOrderACL = function(request,tbnamerole='admin') {
    var roleQuery = new AV.Query(AV.Role);
    roleQuery.equalTo('name', tbnamerole);
    roleQuery.find()
        .then(function(roles) {
            if(roles.length == 0){
                console.log('====创建'+tbnamerole+'角色');
                var _Role = AV.Object.extend('_Role');
                var role = new _Role();
                role.set('name',tbnamerole);
                console.log("===将当前登录用户加入本角色");
                //为当前用户赋予该角色
                role.getUsers().add(request.user);
                role.save().then(function (res) {
                    console.log("====创建"+tbnamerole+"角色,并设置档案的默认权限");
                    var seller_Id = request.object.get('seller_Id');
                    if(seller_Id){
                        var query = new AV.Query(AV.User);
                        query.get(seller_Id).then(function (seller) {
                            var roleAcl = new AV.ACL();
                            roleAcl.setPublicReadAccess(false);
                            roleAcl.setPublicWriteAccess(false);
                            roleAcl.setReadAccess(request.user, true);
                            roleAcl.setWriteAccess(request.user, true);
                            roleAcl.setReadAccess(seller, true);
                            roleAcl.setWriteAccess(seller, true);
                            roleAcl.setRoleReadAccess(res, true);
                            roleAcl.setRoleWriteAccess(res, true);
                            request.object.setACL(roleAcl);
                            request.object.save().then(function (res) {
                                console.log("===Order权限设置完毕");
                            }).catch(function (err) {
                                console.error(err);
                            });
                        });
                    }
                    else {
                        var roleAcl = new AV.ACL();
                        roleAcl.setPublicReadAccess(false);
                        roleAcl.setPublicWriteAccess(false);
                        roleAcl.setReadAccess(request.user, true);
                        roleAcl.setWriteAccess(request.user, true);
                        roleAcl.setRoleReadAccess(res, true);
                        roleAcl.setRoleWriteAccess(res, true);
                        request.object.setACL(roleAcl);
                        request.object.save().then(function (res) {
                            console.log("===Order权限设置完毕");
                        }).catch(function (err) {
                            console.error(err);
                        });
                    }
                }).catch(function (err) {
                    console.error(err);
                });
            }else {
                console.log("====存在"+tbnamerole+"角色，设置档案的默认权限");
                var seller_Id = request.object.get('seller_Id');
                if (seller_Id){
                    var query = new AV.Query(AV.User);
                    query.get(seller_Id).then(function (seller) {
                        var roleAcl = new AV.ACL();
                        roleAcl.setPublicReadAccess(false);
                        roleAcl.setPublicWriteAccess(false);
                        roleAcl.setReadAccess(request.user, true);
                        roleAcl.setWriteAccess(request.user, true);
                        roleAcl.setReadAccess(seller, true);
                        roleAcl.setWriteAccess(seller, true);
                        roleAcl.setRoleReadAccess(roles[0], true);
                        roleAcl.setRoleWriteAccess(roles[0], true);
                        request.object.setACL(roleAcl);
                        request.object.save().then(function (res) {
                            console.log("权限设置完毕");
                        }).catch(function (err) {
                            console.error(err);
                        });
                    })
                }
                else {
                    var roleAcl = new AV.ACL();
                    if(tbnamerole == "Reviews"){
                         roleAcl.setPublicReadAccess(true);
                    }
                    else{
                        roleAcl.setPublicReadAccess(false);
                    }
                    roleAcl.setPublicWriteAccess(false);
                    roleAcl.setReadAccess(request.user, true);
                    roleAcl.setWriteAccess(request.user, true);
                    roleAcl.setRoleReadAccess(roles[0], true);
                    roleAcl.setRoleWriteAccess(roles[0], true);
                    request.object.setACL(roleAcl);
                    request.object.save().then(function (res) {
                        console.log("权限设置完毕");
                    }).catch(function (err) {
                        console.error(err);
                    });
                }
            }
        }).catch(function (err) {
        console.log(err);
    });
}

module.exports.setDefaultDocACL = function(request,tbnamerole='admin') {
    var roleQuery = new AV.Query(AV.Role);
    roleQuery.equalTo('name', tbnamerole);
    roleQuery.find()
        .then(function(roles) {
            if(roles.length == 0){
                console.log('====创建'+tbnamerole+'角色');
                var _Role = AV.Object.extend('_Role');
                var role = new _Role();
                role.set('name',tbnamerole);
                console.log("===将当前登录用户加入本角色");
                //为当前用户赋予该角色
                role.getUsers().add(request.user);

                role.save().then(function (res) {
                    console.log("====创建"+tbnamerole+"角色,并设置档案的默认权限");
                    var roleAcl = new AV.ACL();
                    roleAcl.setPublicReadAccess(true);
                    roleAcl.setPublicWriteAccess(false);
                    roleAcl.setReadAccess(request.user, true);
                    roleAcl.setWriteAccess(request.user, true);
                    roleAcl.setRoleReadAccess(res, true);
                    roleAcl.setRoleWriteAccess(res, true);
                    request.object.setACL(roleAcl);
                    request.object.save().then(function (res) {
                        console.log("权限设置完毕");
                    }).catch(function (err) {
                        console.error(err);
                    });
                }).catch(function (err) {
                    console.error(err);
                });
            }else {
                console.log("====存在"+tbnamerole+"角色，设置档案的默认权限");
                var roleAcl = new AV.ACL();
                console.log(request.object.id);
                if(typeof(request.user) == "undefined"){
                    console.log("--无当前登录用户");
                    roleAcl.setPublicReadAccess(true);
                    roleAcl.setPublicWriteAccess(true);
                    roleAcl.setRoleReadAccess(roles[0], true);
                    roleAcl.setRoleWriteAccess(roles[0], true);
                    request.object.setACL(roleAcl);
                    request.object.save().then(function (res) {
                        console.log("===权限设置完毕");
                    }).catch(function (err) {
                        console.error(err);
                    });
                }else{
                    console.log("--有当前登录用户");
                    roleAcl.setPublicReadAccess(true);
                    roleAcl.setPublicWriteAccess(false);
                    roleAcl.setReadAccess(request.user, true);
                    roleAcl.setWriteAccess(request.user, true);
                    roleAcl.setRoleReadAccess(roles[0], true);
                    roleAcl.setRoleWriteAccess(roles[0], true);
                    request.object.setACL(roleAcl);
                    request.object.save().then(function (res) {
                        console.log("===权限设置完毕");
                    }).catch(function (err) {
                        console.error(err);
                    });
                }
            }
        });
}