function gen(com) {
    let str = `  

// generated on ${new Date().toLocaleString()}
var AV = require('leanengine')
var ${com.code} = require('./${com.code.toLowerCase()}.ex')
  `
    if (com.statemachine && com.statemachine.statelist) {
        com.statemachine.transitionlist.forEach(t => {
            str += `
/* ${t.name} */
AV.Cloud.define('${com.main.code}_${t.code}', function(request, response) {
      ${com.code}.${com.main.code}_${t.code}Sync(request, response);
});
`
        })
    }
    str += genCommon(com, com.main);
    com.sublist.forEach(function(sub) {
        str += genCommon(com, sub);
    }, this);
    return str
}

function genCommon(com, entity) {
    let str = `
// ${entity.name}
/* 保存之前 */
AV.Cloud.beforeSave('${entity.code}', function(request) {
    ${com.code}.${entity.code}_beforeSaveSync(request);
});

/* 保存之后 */
AV.Cloud.afterSave('${entity.code}', function(request) {
      ${com.code}.${entity.code}_afterSaveSync(request);
});

/* 更新之前 */
AV.Cloud.beforeUpdate('${entity.code}', function(request) {
      ${com.code}.${entity.code}_beforeUpdateSync(request);
});

/* 更新之后 */
AV.Cloud.afterUpdate('${entity.code}', function(request) {
      ${com.code}.${entity.code}_afterUpdateSync(request);
});

/* 删除之前 */
AV.Cloud.beforeDelete('${entity.code}', function(request) {
      ${com.code}.${entity.code}_beforeDeleteSync(request);
});

/* 删除之后 */
AV.Cloud.afterDelete('${entity.code}', function(request) {
      ${com.code}.${entity.code}_afterDeleteSync(request);
});`
    return str;
}
module.exports.gen = gen