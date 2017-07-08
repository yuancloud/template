function gen(com) {
    let str = `
    import {${com.main.code}Base,${com.main.code}QueryBase,${com.main.code}ImageFileBase`
    com.sublist.forEach(sub => str += `,${sub.code}Base`);
    com.dtolist.forEach(sub => str += `,${sub.code}Base`);
    str += `} from './entity.g';
    import AV from 'leancloud-storage';
     // generated on ${new Date().toLocaleString()}
    /** ${com.main.name} */
    export default class ${com.main.code} extends ${com.main.code}Base {

    }
    `
    com.sublist.forEach((sub) => {
        str += `
    /** ${sub.name} */ 
    export class ${sub.code} extends ${sub.code}Base
    {}
            `
    });
    com.dtolist.forEach((sub) => {
        str += `
    /** ${sub.name} */ 
    export class ${sub.code}  extends ${sub.code}Base
    {}
            `
    });
    str += ` 
    export class ${com.main.code}Query extends ${com.main.code}QueryBase {
    }
    export class ${com.main.code}ImageFile extends ${com.main.code}ImageFileBase {
    }
    `;

    return str;
}

module.exports.gen = gen;