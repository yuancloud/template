// 生成vuejs
var isnode = false
var common = require('./common')

function gen(com, comlist, _isnode = false) {
    isnode = _isnode;
    let str = `
        ${isnode ? "var AV = require('leanengine');" : "import AV from 'leancloud-storage';"}
        ${isnode ? "" : "import ctx from '../../../common/js/front.context.g';"}
     // generated on ${new Date().toLocaleString()}
    /** ${com.main.name} */
${isnode ? "" : " export "} class ${com.main.code}Base {
    `
    str += getcommonfunc(com.main);
    //str += getstaticenumfunc(com.enumlist);
    str += getstaticstatefunc(com.statemachine);

    com.sublist.forEach((p) => {
            str += `
         /** ${p.name} 实体集合*/
        get${p.code}Entitylist(){
        let q = this.${p.code.toLowerCase()}list.query();
               `
            p.propertylist.filter(f => f.type.toLowerCase().startsWith('ref_') || f.type.toLowerCase() == 'image').forEach(function(element) {
                str += `q.include('${element.code}');// 子实体的引用默认加载
        `
            }, this);
            str += `
            return q.find();
        }

        /** ${p.name} 引用集合*/
        get ${p.code.toLowerCase()}list() {return this.relation('${p.code.toLowerCase()}list');}

        /** ${p.name} */
        push_${p.code.toLowerCase()}(${p.code.toLowerCase()}Orlist) {
            this.relation('${p.code.toLowerCase()}list').add(${p.code.toLowerCase()}Orlist);
        }

        remove_${p.code.toLowerCase()}(${p.code.toLowerCase()}Orlist) {
             this.relation('${p.code.toLowerCase()}list').remove(${p.code.toLowerCase()}Orlist);
        }
        `;
        })
        // com.main.propertylist.filter(f => f.code.toLowerCase() != 'createdat' && f.code.toLowerCase() != 'updatedat').forEach((p, index) => {
        //     if (p.code.toLowerCase() != 'state')
        //         str += `
        //                 /** ${p.name} */
        //                 set ${ p.code}(_${p.code}) { this.set('${p.code}', _${p.code}); }
        //                 `;

    //     str += `
    //             /** ${p.name} */
    //             get ${ p.code}() { return this.get('${p.code}'); }
    //             `
    // })
    str += `
                toEntityData() {
                let r = this;
                `
    let commonreturnobj = common.commontoEntityData(com, com.main, comlist, true);
    str += commonreturnobj.str;
    str += `
        return r;
        }
`
    str += getstaticenumfunc(commonreturnobj.enumlist);
    str += `
        /**暂不支持子实体 */
        static fromEntityData(data) { 
            let entity = AV.Object.createWithoutData('${com.main.code}', data.objectId);
       `
    str += commonfromEntityData(com.main.propertylist);

    str += `
            return entity;
        }

        /** 获取 */
        static get${com.main.code}(objectId){
            let entity =  AV.Object.createWithoutData('${com.main.code}', objectId);
            return entity.fetch();
        }
        /** 删除 */
        delete() {
            return this.destroy();
        }
        /** 删除 */
        static delete(objectId) {
            let entity = AV.Object.createWithoutData('${com.main.code}', objectId);
            return entity.destroy();
        }
                `
    if (com.statemachine && com.statemachine.transitionlist) {
        com.statemachine.transitionlist.forEach(t => {
            str += `
    /** ${t.name} */
     ${t.code} (changedata){
        if (!id) return console.error('参数错误');
        if(!changedata)changedata={};
        changedata.objectId=id;
        return AV.Cloud.run('${com.main.code}_${t.code}', changedata);
    }
`
        })
    }
    str += `
            }
            `;
    if (isnode) str += `module.exports.${com.main.code}Base  =  ${com.main.code}Base ;`;
    com.sublist.forEach((sub) => {
        str += `
            /** ${sub.name} */ 
            ${isnode ? "" : " export "} class ${sub.code}Base
            {`
        str += getcommonfunc(sub);
        // sub.propertylist.filter(f => f.code.toLowerCase() != 'createdat' && f.code.toLowerCase() != 'updatedat').forEach((p, index) => {
        //     str += `
        //         /** ${p.name} */
        //         set ${ p.code}(_${p.code}) { this.set('${p.code}', _${p.code}); }
        //         `;

        //     str += `
        //         /** ${p.name} */
        //         get ${ p.code}() { return this.get('${p.code}'); }
        //         `
        // })
        str += `
                toEntityData() {
                let r = this;
`
        let commonreturnobj = common.commontoEntityData(com, sub, comlist);
        str += commonreturnobj.str;

        str += `
        return r;
        }
`
        str += getstaticenumfunc(commonreturnobj.enumlist);
        str += `
       
        static fromEntityData(data) {
            let entity =AV.Object.createWithoutData('${sub.code}', data.objectId);
       `
        str += commonfromEntityData(sub.propertylist);

        str += `
            return entity;
        }
}
        `
        if (isnode) str += `module.exports. ${sub.code}Base  =  ${sub.code}Base ;`
    })
    str += `
            
            `;
    com.dtolist.forEach((sub) => {
        str += `
            /** ${sub.name} */ 
            ${isnode ? "" : " export"} class ${sub.code}Base
            {`
        sub.propertylist.forEach((p, index) => {
            str += `  
            /* ${p.name} */
            set ${p.code}(_${p.code}) {this._${p.code} = _${p.code};}
            /* ${p.name} */
            get ${p.code}() { return this._${p.code};} `
        })

        str += `}


        `
        if (isnode) str += `module.exports. ${sub.code}Base  =  ${sub.code}Base ;`
    })
    str += `${isnode ? "" : " export"} class ${com.main.code}QueryBase extends AV.Query {
        constructor(includeall = false) {
            super('${com.main.code}');
              if (includeall) {
                  `
    com.main.propertylist.filter(f => f.type.toLowerCase().startsWith('ref_') || f.type.toLowerCase() == 'image').forEach(function(element) {
        str += `q.include('${element.code}');
        `
    }, this);
    str += `
        }
        }
    }`;

    str += `${isnode ? "" : " export"} class ${com.main.code}ImageFileBase extends AV.File {

    }`;
    return str;
}



function getstaticstatefunc(statemachine) {
    if (statemachine.statelist == null) return '';
    let str = '';
    let e = statemachine;

    str += `
    /** 状态 */
         getStateValtoName(){return {
            `
    e.statelist.forEach((p, index) => {
        str += `
        ${p.val}:'${p.name}',`
    });
    str = str.substr(0, str.length - 1);
    str += `};
}

         getStateCodetoVal(){return {
            `
    e.statelist.forEach((p, index) => {
        str += `
        ${p.code}:${p.val},`
    });
    str = str.substr(0, str.length - 1);
    str += `};
}
    `

    return str;
}

function getstaticenumfunc(enumlist) {
    let str = '';
    enumlist.forEach((e) => {
        str += `/** ${e.name} */
         get${e.code}ValtoName(){return {
            `
        e.literallist.forEach((p, index) => {
            str += `
            ${p.val}:'${p.name}',`
        });
        str = str.substr(0, str.length - 1);
        str += `};
    }

         get${e.code}CodetoVal(){return {
            `
        e.literallist.forEach((p, index) => {
            str += `
            ${p.code}:${p.val},`
        });
        str = str.substr(0, str.length - 1);
        str += `};
    }
    `
    });
    return str;
}

function commonfromEntityData(propertylist) {
    let str = '';
    propertylist.filter(f => f.code.toLowerCase() != 'createdat' && f.code.toLowerCase() != 'updatedat').forEach((p) => {
        if (p.code.trim().toLowerCase() != "state") {
            if (p.type.trim().toLowerCase().startsWith('ref_')) {
                str += `if (data.objectId||(!data.objectId&&data.${p.code} && data.${p.code}.className))
                        entity.${p.code}=data.${p.code};
        `
            } else if (p.type.trim().toLowerCase() == 'image') {

                str += `if (data.objectId||(!data.objectId&&data.${p.code}))
                        entity.${p.code}=data.${p.code};
        `
            } else if (p.type.trim().toLowerCase() == 'array') {

                str += `if (data.objectId || !data.objectId&&data.${p.code}.length > 0)
                        entity.${p.code}=data.${p.code};
        `
            } else {
                str += `
                    entity.${ p.code} = data.${p.code};
                    `;
            }
        }
    })
    return str;
}

function getcommonfunc(entity) {
    str = `      
    static create${entity.code}() {
        return AV.Object.createWithoutData('${entity.code}');
    }

 static getDefaultData() {
        return {`
    entity.propertylist.forEach((p, index) => {
        str += common.getDefaultValuebyProrperty(p.type, p.code, p.name);
    });
    str = str.substr(0, str.length - 1);
    str += `
};
}`
    return str;
}
module.exports.gen = gen;