function gen(com) {
    let exportlist = [];
    let str = `  
// ${com.main.name}
// generated on ${new Date().toLocaleString()}
var AV = require('leanengine')
var base = require('./${com.code.toLowerCase()}.g')
`
    let r = genHookfunc(com.main);
    exportlist = exportlist.concat(r.exportlist);
    str += r.str;

    if (com.statemachine && com.statemachine.transitionlist) {
        com.statemachine.transitionlist.forEach(t => {
            exportlist.push(`${com.main.code}_${t.code}Sync`);
            str += `
    /* ${t.name} */
     async function  ${com.main.code}_${t.code}Sync (request, response)
    {
      return await base.${com.main.code}_${t.code}Sync(request, response);
    }
`
        })
    }

    com.sublist.forEach(function(entity) {
        str += `
    `
        let r = genHookfunc(entity);
        exportlist = exportlist.concat(r.exportlist);
        str += r.str;
        str += `
    
    `
    }, this);
    str += `
    module.exports = {
    `
    exportlist.forEach(function(e) {
        str += `${e}:${e},`
    }, this);
    str += `}
    `
    return str
}

function genHookfunc(entity) {
    let str = `
    /* 保存之前 */
  async function   ${entity.code}_beforeSaveSync(request) { 
      let r =await base.${entity.code}_beforeSaveSync(request);
      return r;
   }
    /* 保存之后 */
  async function  ${entity.code}_afterSaveSync(request) {       
      let r =await base.${entity.code}_afterSaveSync(request);
      return r; }
    /* 更新之前 */
   async function ${entity.code}_beforeUpdateSync(request) {       
      let r =await base.${entity.code}_beforeUpdateSync(request);
      return r; }
    /* 更新之后 */
   async function ${entity.code}_afterUpdateSync(request) {   
       let r =await base.${entity.code}_afterUpdateSync(request);
      return r; }
    /* 删除之前 */
   async function ${entity.code}_beforeDeleteSync(request) { 
       let r =await base.${entity.code}_beforeDeleteSync(request);
      return r; }
    /* 删除之后 */
   async function ${entity.code}_afterDeleteSync(request) { 
       let r =await base.${entity.code}_afterDeleteSync(request);
      return r; }
`;
    return {
        exportlist: [`${entity.code}_afterDeleteSync`,
            `${entity.code}_beforeDeleteSync`,
            `${entity.code}_afterUpdateSync`,
            `${entity.code}_beforeUpdateSync`,
            `${entity.code}_afterSaveSync`,
            `${entity.code}_beforeSaveSync`
        ],
        str: str
    }
}
module.exports.gen = gen