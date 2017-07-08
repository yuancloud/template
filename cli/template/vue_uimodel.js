function gen(com) {
    if (com == null) com = new meta.com()
    let str = `
    import ctx from '../../../common/js/front.context.g';
     // generated on ${new Date().toLocaleString()}
    export class UIModel${com.main.code}{
    constructor() {

             this.state = {
`;
    if (com.statemachine && com.statemachine.statelist) {
        com.statemachine.statelist.forEach((p, index) => {
            if (index == com.statemachine.statelist.length - 1) str += `${p.code}:${p.val} // ${p.name}
                `
            else str += `${p.code}:${p.val}, // ${p.name}
`
        })
    }
    str += `};
             this.key = {
`;
    com.main.propertylist.forEach((p, index) => {
        if (index == com.main.propertylist.length - 1) str += `${p.code}:'${p.code}' // ${p.name}
                `
        else str += `${p.code}:'${p.code}', // ${p.name}
`
    })
    str += `};
             this.desc = {
`;
    com.main.propertylist.forEach((p, index) => {
        str += `${p.code}:'${p.name}', // ${p.code}
`
    })
    if (com.statemachine && com.statemachine.statelist) {
        com.statemachine.statelist.forEach((p, index) => {
            str += `state_${p.code}:'${p.name}', // val=${p.val}
`
        })
    }
    str = str.substr(0, str.length);
    str += `};
}
} 

`
    com.sublist.forEach((sub) => {
        str += `
 export class UIModel${sub.code}{
    constructor() {
        this.data = {
            `;
        sub.propertylist.forEach((p, index) => {
            str += getdefaultvalue(p);
        })
        str = str.substr(0, str.length);
        str += `};
             this.key = {
`;
        sub.propertylist.forEach((p, index) => {
            if (index == sub.propertylist.length - 1) str += `      ${p.code}:'${p.code}' // ${p.name}
                `
            else str += `       ${p.code}:'${p.code}', // ${p.name}
`
        })
        str += `};
             this.desc = {
`;
        sub.propertylist.forEach((p, index) => {
            if (index == sub.propertylist.length - 1) str += `      ${p.code}:'${p.name}' // ${p.code}
                `
            else str += `       ${p.code}:'${p.name}', // ${p.code}
`
        })
        str += `};}}`
    });


    return str;
}

function getdefaultvalue(property) {
    if (property.type.trim().toLowerCase().startsWith('ref_')) {
        if (property.code.toLowerCase().endsWith('createdby')) {
            return `${property.code}:ctx.getCurrentUser(), // ${property.name} : ${property.type} 
                ${property.code}Display:'',
`
        } else if (property.code.toLowerCase().endsWith('modifiedby')) {
            return `${property.code}:{}, // ${property.name} : ${property.type} 
                ${property.code}Display:'', 
`;
        } else {
            return `${property.code}:{}, // ${property.name} : ${property.type} 
        ${property.code}Display:'',
`
        }
    } else if (property.type.toLowerCase().startsWith('enum_')) {
        return `${property.code}:0, // ${property.name} : ${property.type} 
        ${property.code}Display:'',
`
    } else if (property.code.toLowerCase().endsWith('code')) {
        return `${property.code}:'', // ${property.name} : ${property.type} 
`
    } else if (property.code.toLowerCase().endsWith('name')) {
        return `${property.code}:'', // ${property.name} : ${property.type} 
`
    } else if (property.code.toLowerCase().endsWith('orderno')) {
        return `${property.code}:'', // ${property.name} : ${property.type} 
`
    }
    switch (property.type.toLowerCase()) {
        case "boolean":
            return `${property.code}:false, // ${property.name} : ${property.type} 
                    ${property.code}Display:'否',
`
        case "image":
            return `${property.code}:{}, // ${property.name} : ${property.type} 
${property.code}Display:'',
${property.code}URL:'',

`
        case "double":
            return `${property.code}:0.0, // ${property.name} : ${property.type} 
`
        case "rate":
            return `${property.code}:0, // ${property.name} : ${property.type} 
`
        case "integer":
            return `${property.code}:0, // ${property.name} : ${property.type} 
`
        case "object":
            return `${property.code}:{}, // ${property.name} : ${property.type} 
`
        case "geo":
            return `${property.code}:{}, // ${property.name} : ${property.type} 
`
        case "year":
        case "yearMonth":
        case "date":
        case "datetime":
        case "time":
            return `${property.code}:new Date(), // ${property.name} : ${property.type} 
`
        case "string":
        case "email":
        case "phone":
        default:
            return `${property.code}:'', // ${property.name} : ${property.type} 
`
    }
}

function gettestvalue() {
    if (property.type.trim().toLowerCase().startsWith('ref_')) {

    } else if (property.type.toLowerCase().sWith('enum_')) {

    } else if (property.code.toLowerCase().endsWith('code')) {} else if (property.code.toLowerCase().endsWith('createdby')) {} else if (property.code.toLowerCase().endsWith('modifiedby')) {} else if (property.code.toLowerCase().endsWith('name')) {} else if (property.code.toLowerCase().endsWith('orderno')) {}
    switch (property.type.toLowerCase()) {
        case "boolean":
            break;
        case "string":
            break;
        case "image":
            break;
        case "double":
            break;
        case "rate":
            break;
        case "integer":
            break;
        case "object":
            break;
        case "email":
            break;
        case "phone":
            break;
        case "geo":
            break;
        case "year":
            break;
        case "yearMonth":
            break;
        case "date":
            break;
        case "datetime":
            break;
        case "time":
            break;
        default:
            break;
    }

}

module.exports.gen = gen;