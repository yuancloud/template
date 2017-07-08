module.exports.genfilelog = function genfilelog(filepath) {
    console.log('[' + ++GLOBAL.count + ']generate file :' + filepath);
    return filepath;
}

module.exports.commontoEntityData = function commontoEntityData(com, entity, comlist, isaddchangeset = false, defaultimg = "'../../../../static/img/addto@2x.png'") {
    let str = '';
    let enumlist = [];
    str += `r.objectId = e.get('objectId')
    `;
    for (var index = 0; index < entity.propertylist.length; index++) {
        let p = entity.propertylist[index];
        rt = commontoEntityDataProperty(p.type, p.code, p.name, com, comlist, defaultimg);
        str += rt.str;
        enumlist.join(rt.enumlist);
    }
    str += `
    console.log(r);
    const self = this;
    `
    entity.propertylist.filter(f => f.code != 'createdAt' && f.code != 'updatedAt').forEach(function(p) {
        str += definePropertyGetSet(p.type, p.code, p.name, isaddchangeset);
    });

    return { str, enumlist };
}

function definePropertyGetSet(ptype, pcode, pname, isaddchangeset) {
    let str = '';
    if (ptype.toLowerCase().startsWith('ref_')) {
        str += `Object.defineProperty(r, '${pcode}Id', { set: function (v) {`
        if (isaddchangeset) { str += ` self.addchangeset(self,'${pcode}',new AV.Object.createWithoutData('${ptype.substr(4)}',v),new AV.Object.createWithoutData('${ptype.substr(4)}',this._${pcode}));` }
        str += ` this._${pcode}.id = v; }, get: function () { return this._${pcode}.get('objectId'); } });
     `;
    } else if (ptype.toLowerCase() == 'image') {
        str += `Object.defineProperty(r, '${pcode}Id', { set: function (v) {`
        if (isaddchangeset) { str += ` self.addchangeset(self,'${pcode}',new AV.Object.createWithoutData('_File',v),new AV.Object.createWithoutData('_File',this._${pcode}));` }
        str += ` this._${pcode}.id = v; }, get: function () { return this._${pcode}.get('objectId'); } });
     `;
    } else if (ptype.toLowerCase().startsWith('array_')) {
        for (var index = 1; index < Number.parseInt(ptype.split('_').slice(-1)[0]) + 1; index++) {
            str += definePropertyGetSet(ptype.split('_').slice(1)[0], pcode + index, pname + index, isaddchangeset);;
        }

    } else {
        str += `Object.defineProperty(r, '${pcode}', { set: function (v) {`
        if (isaddchangeset) { str += ` self.addchangeset(self,'${pcode}',v,this._${pcode});` }
        str += ` this._${pcode} = v; }, get: function () { return this._${pcode}; } });
         `;
    }
    return str;
}

function commontoEntityDataProperty(ptype, pcode, pname, com, comlist, defaultimg) {
    let enumlist = [];
    let str = '';

    if (ptype.trim().toLowerCase().startsWith('ref_')) {
        str += `
        if(e.get('${pcode}')){
            r._${pcode} = e.get('${pcode}')
            r.${pcode}Id = e.get('${pcode}').get('objectId');
            }
            `;
    } else if (ptype.toLowerCase().startsWith('enum_')) {
        if (pcode == 'state') {
            str += ` //State
                  r._state = e.get('state')
                  r.state_name = ({`
            com.statemachine.statelist.forEach((l, index) => {
                str += `${l.val}:'${l.name}',`
            });
            str = str.substr(0, str.length - 1);
            str += `})[r._state]
            `
        } else {
            let refenum = {};
            comlist.filter(f => f.enumlist != null && f.enumlist.length > 0).forEach((c, i) => {
                let refenumlist = c.enumlist.filter(e => ptype.toLowerCase() == 'enum_' + e.code.toLowerCase());
                if (refenumlist != null && refenumlist.length == 1) {
                    refenum = refenumlist[0];
                    refenum.literallist = refenumlist[0].literallist;
                    return;
                }
            }, this);
            //enumlist.push(refenum);
            if (refenum && refenum.code) {
                str += ` // ${refenum.name} ${refenum.code}
                     r._${pcode} = e.get('${pcode}')
                  r.${pcode}_name = ({`
                refenum.literallist.forEach((l, index) => {
                    str += `${l.val}:'${l.name}',`
                });
                str = str.substr(0, str.length - 1);
                str += `})[r._${pcode}]
            `
            } else {
                throw new ExceptionInformation("组件：" + com.code + "的属性" + pcode + "未定义类型:" + ptype);
            }
        }
    } else if (ptype.toLowerCase().startsWith('array_')) {
        for (var index = 1; index < Number.parseInt(ptype.split('_').slice(-1)[0]) + 1; index++) {
            let rtinternal = commontoEntityDataProperty(ptype.split('_').slice(1)[0], pcode + index, pname + index, com, comlist, defaultimg);
            str += rtinternal.str;
            enumlist.join(rtinternal.enumlist);
        }


        // } else if (pcode == 'code') {

        // } else if (pcode == 'orderno') {

    } else { // 普通字段
        switch (ptype.toLowerCase()) {
            case "boolean":
                {
                    str += `
                        r._${pcode} = e.get('${pcode}');
                        r.${pcode}_name = r._${pcode} ? '是' : '否';
                        `;
                    break;
                }
            case "string":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "image":
                { //参考ref处理
                    str += `
                    if(e.get('${pcode}')) {
                    r._${pcode} = e.get('${pcode}')
                    r.${pcode}Id = e.get('${pcode}').get('objectId');
                    r.${pcode}_name = e.get('${pcode}').name();
                    r.${pcode}URL =e.get('${pcode}').thumbnailURL(200,200);
                    r.${pcode}OriginURL =e.get('${pcode}').url();
                 }else{
                      r.${pcode}URL =${defaultimg.toString()};
                      r.${pcode}OriginURL = ${defaultimg.toString()};
                 }
        `
                    break;
                }
            case "double":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "integer":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "rate":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "object":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "email":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "phone":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "geo":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "year":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "yearmonth":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "date":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "datetime":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "time":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            case "array":
                {
                    str += `
                    r._${pcode} = e.get('${pcode}');`;
                    break;
                }
            default:
                {
                    //break;
                    throw new Error("组件：" + com.code + "的属性" + pcode + "未定义类型:" + ptype);
                }
        }
    }

    return { str, enumlist };
}

module.exports.getEnumInfobyProrperty = function getenuminfobyprorpertycode(com, comlist, enumprop) {
    let refenum = {};
    let statelist = {};
    if (enumprop.code == 'state') {
        statelist = com.statemachine.statelist;
    } else {

        currentcomlist = com.enumlist.filter(f => "enum_" + f.code.toLowerCase() == enumprop.type.toLowerCase())
        if (currentcomlist && currentcomlist.length > 0) {
            refenum = currentcomlist[0];
            statelist = refenum.literallist;
        } else {
            comlist.filter(f => f.enumlist != null && f.enumlist.length > 0).forEach((c, i) => {
                let refenumlist = c.enumlist.filter(e => enumprop.type.toLowerCase() == 'enum_' + e.code.toLowerCase());
                if (refenumlist != null && refenumlist.length == 1) {
                    refenum = refenumlist[0];
                    statelist = refenumlist[0].literallist;
                    return;
                }
            }, this);
        }
        if (!refenum.code) throw Error('未找到枚举：' + enumproptype + '定义')
    }
    return { refenum: refenum, statelist: statelist }
}

module.exports.getDefaultValuebyProrperty = function getdefaultvalue(ptype, pcode, pname) {
    let str = '';
    if (ptype.trim().toLowerCase().startsWith('ref_')) {
        str += `// ${pname} : ${ptype}
        ${pcode}Id:'',`
    } else if (ptype.toLowerCase().startsWith('enum_')) {
        if (pcode.toLowerCase() == 'state') {
            str += `
            // ${pname} : ${ptype}
            ${pcode}:1,
            ${pcode}_name:'',`
        } else {
            str += `
            // ${pname} : ${ptype}
            ${pcode}:0,
        ${pcode}_name:'',`
        }
    } else if (pcode.toLowerCase() == 'code') {
        str += `
        // ${pname} : ${ptype}
        ${pcode}:'',`
    } else if (pcode.toLowerCase() == 'name') {
        str += `
    // ${pname} : ${ptype}
    ${pcode}:'',`
    } else if (pcode.toLowerCase().endsWith('orderno')) {
        str += `// ${pname} : ${ptype}
        ${pcode}:'',`
    } else if (ptype.toLowerCase().startsWith('array_')) {
        for (var index = 1; index < Number.parseInt(ptype.split('_').slice(-1)[0]) + 1; index++) {
            str += getdefaultvalue(ptype.split('_').slice(1)[0], pcode + index, pname + index);
        }
    } else switch (ptype.toLowerCase()) {
        case "array":
            str += `
            ${pcode}:[],`;
            break;
        case "boolean":
            str += `
            ${pcode}:false, // ${pname} : ${ptype}
                    ${pcode}_name:'否',`
            break;
        case "image":
            str += `
            // ${pname} : ${ptype}
            ${pcode}Id:'',
            ${pcode}_name:'',
            ${pcode}URL:'',`
            break;
        case "double":
            str += `
            // ${pname} : ${ptype}
            ${pcode}:0.0,`
            break;
        case "rate":
            str += `
            // ${pname} : ${ptype}
            ${pcode}:0,`
            break;
        case "integer":
            str += `
            // ${pname} : ${ptype}
            ${pcode}:0,`
            break;
        case "object":
            str += `
            // ${pname} : ${ptype}
            ${pcode}:{},`
            break;
        case "geo":
            str += `
            // ${pname} : ${ptype}
            ${pcode}:{},`
            break;
        case "year":
            break;
        case "yearmonth":
            break;
        case "date":
            break;
        case "datetime":
            break;
        case "time":
            str += `
            // ${pname} : ${ptype}
            ${pcode}:new Date(),`
            break;
        case "string":
        case "email":
        case "phone":
        default:
            str += `
            // ${pname} : ${ptype}
            ${pcode}:'',`
            break;
    }
    str += `
    `
    return str;
}