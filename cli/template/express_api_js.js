function gen(com, comlist) {
    let exportlist = [];
    let str = `  
             // ${com.main.name}
             // generated on ${new Date().toLocaleString()}
            var AV = require('leanengine');
            var ctx = require('../../common');
    `
    str += genHookfunc(com, comlist, com.main);
    exportlist = exportlist.concat([`${com.main.code}_afterDeleteSync`,
        `${com.main.code}_beforeDeleteSync`,
        `${com.main.code}_afterUpdateSync`,
        `${com.main.code}_beforeUpdateSync`,
        `${com.main.code}_afterSaveSync`,
        `${com.main.code}_beforeSaveSync`,
        `${com.main.code}_onsetdefaultvalueSync`
    ]);
    if (com.statemachine && com.statemachine.statelist) {
        com.statemachine.transitionlist.forEach(t => {
            exportlist.push(`${com.main.code}_${ t.code}Sync`);
            str += `
        /* ${t.name} */
   async function ${com.main.code}_${ t.code}Sync(request, response) {
    var changedata = request.params.changedata;
          var entity = AV.Object.createWithoutData('${com.main.code}', request.params.objectId);
          entity.fetch()
              .then(() => {
                  const currentState = entity.get('state')
                  if (currentState != ${t.fromstateval}) return response.success({
                      msg: "业务异常：${com.main.name}("+request.params.objectId+")当前状态为"+currentState+",状态应该为${t.tostateval}",
                      entity: entity,
                      issuccessed: false
                  })
                  else {
                      var key = '';
                      for (key in changedata) {
                          entity.set(key, changedata[key]);
                      }
        entity.set('state', ${ t.tostateval});//${t.fromstate}:${t.fromstateval}=>${t.tostate}:${t.tostateval}
`
            if (com.mappedenumlist && com.mappedenumlist.length > 0) {
                com.mappedenumlist.filter(f => f.src.endsWith('_StateMachine')).forEach(function(m) {
                    let innextstate = m.tarmap.find(f => f.valmap.indexOf(Number.parseInt(t.fromstateval)) < 0 && f.valmap.indexOf(Number.parseInt(t.tostateval)) > -1)
                    if (innextstate)
                        str += `entity.set('${m.tar}', ${innextstate.val});
                    `
                }, this);
            }
            str += `
                 entity.save()
                          .then(function(result) {
                              return response.success({
                                  msg: '${ t.tostatename}',
                                  entity: entity,
                                  issuccessed: true
                              });
                          })
                          .catch(function(error) {
                              return response.success({
                                  msg: '系统错误：' + JSON.stringify(error),
                                  entity: entity,
                                  issuccessed: false
                              });
                          });
                          }
                        });
    }
    `
        })
    }
    str += `

`
    com.sublist.forEach(function(entity) {
        str += genHookfunc(com, comlist, entity);
        exportlist = exportlist.concat([`${entity.code}_afterDeleteSync`,
            `${entity.code}_beforeDeleteSync`,
            `${entity.code}_afterUpdateSync`,
            `${entity.code}_beforeUpdateSync`,
            `${entity.code}_afterSaveSync`,
            `${entity.code}_beforeSaveSync`,
            `${entity.code}_onsetdefaultvalueSync`,
        ])

    }, this);

    str += `
    module.exports = {`
    exportlist.forEach(function(e) {
        str += `${e}:${e},
        `
    }, this);
    str += `}
    `
    return str
}

function genHookfunc(com, comlist, entity) {
    str = '';
    str += `/* 保存之前 */
   async function ${entity.code}_beforeSaveSync(request) {

}

/* 保存之后 */
 async function ${entity.code}_afterSaveSync(request) {
     console.log("======${entity.code}保存赋值状态(设置为1)--开始=====");
        request.object.set("state", 1);
        `
    if (com.mappedenumlist) {
        com.mappedenumlist.forEach(function(m) {
            str += `request.object.set("${m.tar}", 1);
            `;
        }, this);
    }
    str += `
        console.log("======${entity.code}保存赋值状态(设置为1)--结束=====");
        console.log("======${entity.code}新增保存默认赋值--开始=====");
        ctx.setCreatedBy(request);
        
        console.log("======${entity.code}新增保存默认赋值--结束=====");
    `
    if (com.main.type == 'order') {
        str += `ctx.setDefaultOrderACL(request,'${ com.main.code}'); `;
    } else if (com.main.type == 'doc') {
        str += `ctx.setDefaultDocACL(request,'${ com.main.code}'); `;
    }
    str += `
     await ${entity.code}_onsetdefaultvalueSync(request);
}

/* 更新之前 */
async function ${entity.code}_beforeUpdateSync(request) {
    console.log("======${entity.code}修改保存默认赋值--开始=====");
    ctx.setUpdatedBy(request);

    console.log("======${entity.code}修改保存默认赋值--结束=====");
}

/* 更新之后 */
async function ${entity.code}_afterUpdateSync(request) {
  return await ${entity.code}_onsetdefaultvalueSync(request);
}

/* 删除之前 */
async function ${entity.code}_beforeDeleteSync(request) {}

/* 删除之后 */
async function ${entity.code}_afterDeleteSync(request) {}

/* 默认值 */
async function ${entity.code}_onsetdefaultvalueSync(request) {
    let target_${entity.code} =await AV.Object.createWithoutData('${entity.code}', request.object.id).fetch();
    if (!target_${entity.code}) return;
    `
    entity.rdpropertylist.forEach(function(mp) {
        if ( // (entity.type == 'doc' || entity.type == 'order') && 
            mp.type.toLowerCase().startsWith('rd_sub'))
            return; //子表的冗余字段由子表首条创建时更新赋值
        str += `//${mp.name} -- ${mp.type}  - ${mp.code}
    let r_${mp.code} =await ${entity.code}_onsetdefaultvalue_${mp.code}Sync (target_${entity.code});
    if(r_${mp.code}) request.object.set(r_${mp.code}.k,r_${mp.code}.v);
    `
    }, this);
    if (entity.type == 'sub') {
        str += `let main_${com.main.code} = target_${entity.code}.get('${com.main.code}')
        if(main_${com.main.code}){`
        com.main.rdpropertylist.filter(f => f.type.toLowerCase().startsWith('rd_sub')).forEach(function(mp) {
            str += `
           let r_${mp.code} =await ${com.main.code}_onsetdefaultvalue_${mp.code}Sync (target_${entity.code});
           if(r_${mp.code}) main_${com.main.code}.set(r_${mp.code}.k,r_${mp.code}.v);
           `
        }, this);
        str += `main_${com.main.code}.save();}`;
    }
    str += `
    return await request.object.save();
}
`
    entity.rdpropertylist.forEach(function(mp) {
        if ( //(entity.type == 'doc' || entity.type == 'order') && 
            mp.type.toLowerCase().startsWith('rd_sub'))
            return; //子表的冗余字段由子表首条创建时更新赋值
        str += `
//${mp.type}
//${mp.code}
//${mp.name}
async function ${entity.code}_onsetdefaultvalue_${mp.code}Sync (target_${entity.code}){
    if (target_${entity.code}.get('${mp.code}')) return;
    `
        str += genfindnextproperty(entity, mp, mp.type.split('_').slice(1), entity, com, comlist);
        str += `
}
`
    }, this);
    if (entity.type == 'sub') {
        com.main.rdpropertylist.filter(f => f.type.toLowerCase().startsWith('rd_sub')).forEach(function(mp) {
            str += `
//${mp.type}
//${mp.code}
//${mp.name}
async function ${com.main.code}_onsetdefaultvalue_${mp.code}Sync (target_${entity.code}){
    `
            str += genfindnextproperty(entity, mp, mp.type.split('_').slice(1), entity, com, comlist);
            str += `
}
`
        }, this);
    }
    str += `
    `;
    return str;
}
//tname RD_subline_sku_item_technician_name
function genfindnextproperty(ne, sp, rdlist, e, com, comlist) {
    if (rdlist.length == 1) {
        let tp = ne.propertylist.find(f => f.code.toLowerCase() == rdlist[0]);
        let str = `console.log("====${e.code}.${sp.code}(${sp.type}).onsetdefaultvalue = " + target_${ne.code}.get('${tp.code}'));
    return {k:'${sp.code}',v: target_${ne.code}.get('${tp.code}')};
`
        return str;
    } else {
        let refp = ne.propertylist.find(f => f.code == rdlist[0]);
        let refsub = com.sublist.find(f => 'sub' + f.code.toLowerCase().split('_')[1] == rdlist[0].toLowerCase());
        if (!refp && refsub) {
            //let str = `let target_${refsub.code} =await target_${ne.code}.relation('${refsub.code.toLowerCase() + 'list'}').query().ascending('updatedAt').ascending('createdAt').first();
            //if (target_${refsub.code}){`
            //str += genfindnextproperty(refsub, sp, rdlist.slice(1), e, com, comlist);
            //str += `}//end if(target_${refsub.code})
            //`
            return genfindnextproperty(refsub, sp, rdlist.slice(1), e, com, comlist);;
        } else if (refp && refp.type.toLowerCase().startsWith('ref_')) {
            let isuser = refp.type.toLowerCase().endsWith('_user');
            let nem = null;
            if (isuser) {
                nem = { code: '_User', propertylist: [{ code: 'email' }, { code: 'avatar' }, { code: 'nickname' }, { code: 'username' }, { code: 'mobilePhoneNumber' }] };
            } else {
                nem = comlist.find(f => f.main.code.toLowerCase() == refp.type.toLowerCase().substr(4)).main;
            }
            let entityobjectidvar = sp.type.replace(rdlist.slice(1).join('_'), 'objectId').substr(3)
            let str = `if(target_${ne.code}.get('${refp.code}')){
            let ${entityobjectidvar} = target_${ne.code}.get('${refp.code}').id;
            let target_${nem.code} = await new AV.Query('${nem.code}').get(${entityobjectidvar});
                if(target_${nem.code}){`
            str += genfindnextproperty(nem, sp, rdlist.slice(1), e, com, comlist);
            str += `}//end ${entityobjectidvar}
            }//endQuery if(target_${nem.code})
`
            return str;
        } else {
            throw Error('e:' + e.code + ',sp:' + sp.code + ',sp.type:' + sp.type + ',rdlist[0]:' + rdlist[0])
        }

    }
}
module.exports.gen = gen