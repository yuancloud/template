var fs = require('fs')
var url = require('url')
var request = require('request')
var path = require('path')
var refset = new Set()

function gen(com) {
    let str = `// generated on ${new Date().toLocaleString()}
    //import ${com.main.code}, { ${com.main.code}ImageFile, ${com.main.code}Query} from '../../../../../vue/src/components/${com.code}/model/entity.ex'
`
    com.main.propertylist.filter(f => f.type.toLowerCase().startsWith('ref_') && !f.type.toLowerCase().startsWith('ref__')).forEach(function(p) {
        refset.add(p.type.toLowerCase())
    }, this)
    com.sublist.forEach(function(sub) {
        sub.propertylist.filter(f => f.type.toLowerCase().startsWith('ref_') && !f.type.toLowerCase().startsWith('ref__')).forEach(function(p) {
            refset.add(p.type.toLowerCase())
        }, this)
    }, this)
    for (let ptype of refset.values()) {
        str += `import * as ref${ptype.substr(4)} from '../../${ptype.substr(4)}/default/test.g'
        `
    }
    str += `
import AV from 'leancloud-storage'
import faker from 'faker'
import * as common from '../../home/common';

export async function create() {
    let rt = { count: 0, successed: 0, list: [] }
    rt.count++
    console.log('starting ${com.main.code} test_create')
    `
    str += `
    //新增
    let ${com.main.code.toLowerCase()}1 = AV.Object.createWithoutData('${com.main.code}')
    ${com.main.code.toLowerCase()}1.set('stg',true);
    `
    com.main.propertylist.forEach(function(p) {
        if (!com.main.rdpropertylist.find(f => f.code == p.code) &&
            p.code != 'createdAt' && p.code != 'updatedAt' &&
            p.code != 'createdby' && p.code != 'modifiedby' &&
            com.main.code.toLowerCase() != p.type.substr(4).toLowerCase()
        ) {
            str += `// ${p.name}
            `
            str += gettestdatabytype(p.type, p.code, com.main, com)
        }
    }, this)
    str += `
    let ${com.main.code.toLowerCase()}2 = await ${ com.main.code.toLowerCase() }1.save()
    rt.successed++
    rt.list.push({ case: '${com.main.code}_test_create', result: 1 })
    console.log(${com.main.code.toLowerCase()}2)
    console.log('${com.main.code}_test_create successed')
  `
    com.sublist.forEach(function(sub) {
        str += `
    for (var index = 0; index < faker.random.number(3, 6); index++) {
                    let ${sub.code.toLowerCase()}1 = AV.Object.createWithoutData('${sub.code}')
                    ${sub.code.toLowerCase()}1.set('stg',true);
                        ${sub.code.toLowerCase()}1.set('${com.main.code}',${com.main.code.toLowerCase()}2)
                    `
        sub.propertylist.forEach(function(p) {
            if (!sub.rdpropertylist.find(f => f.code == p.code) &&
                p.code != 'createdAt' && p.code != 'updatedAt' &&
                p.code != 'createdby' && p.code != 'modifiedby' &&
                sub.code.toLowerCase() != p.type.substr(4).toLowerCase()) {
                str += `// ${p.name}
                `
                str += gettestdatabytype(p.type, p.code, sub, com)
            }
        }, this)
        str += ` let sub =await ${sub.code.toLowerCase()}1.save()
                    console.log('${sub.code} save success:' + JSON.stringify(${sub.code.toLowerCase()}1))
                }`
    }, this)
    str += ` return {rt:rt,entity:${ com.main.code.toLowerCase() }2}
    }`
    return str
}

function gettestdatabytype(ptype, pcode, entity, com) {
    let fullname = entity.code + '_' + pcode
    let str = ''
    if (ptype.trim().toLowerCase().startsWith('ref_')) {
        if (ptype.trim().toLocaleLowerCase() == 'ref_user') {
            str += `${entity.code.toLowerCase()}1.set('${pcode}' ,u)`
        } else if (com.main.code.toLowerCase() != ptype.substr(4).toLowerCase()) {
            str += `${entity.code.toLowerCase()}1.set('${pcode}' ,(await ref${ptype.substr(4).toLowerCase()}.create()).entity)`
        } else {
            console.log('自关联')
        }
    } else if (ptype.toLowerCase().startsWith('enum_')) {
        str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.random.number(3))`
    } else if (fullname.toLowerCase().endsWith('code'))
        str += `${entity.code.toLowerCase()}1.set('${pcode}' ,"Test_" + faker.random.number(9999)+'-'+faker.random.number(999))`
    else if (fullname.toLowerCase().endsWith('createdby')) {
        //str += `${entity.code.toLowerCase()}1.set('${pcode}' ,u)`
    } else if (fullname.toLowerCase().endsWith('modifiedby')) {
        //str += `${entity.code.toLowerCase()}1.set('${pcode}' ,u)`
    } else if (fullname.toLowerCase().endsWith('name'))
        str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.fake('{{name.firstName}}{{name.lastName}}{{name.firstName}}{{name.lastName}}{{name.firstName}}{{name.lastName}}'))`
    else if (ptype.toLowerCase().startsWith('array_')) {
        for (var index = 1; index < Number.parseInt(ptype.split('_').slice(-1)[0]) + 1; index++) {
            str += gettestdatabytype(ptype.split('_').slice(1)[0], pcode + index, entity, com)
        }
    } else
        switch (ptype.toLowerCase()) {

            case 'boolean':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.random.boolean())`
                break
            case 'string':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,"Test_"+faker.random.words())`
                break
            case 'image':
                str += `
              const canvas_${pcode} = document.createElement('canvas')
    canvas_${pcode}.getContext('2d').drawImage(await common.loadImage(faker.image.dataUri(750, 750, true)), 0, 0)
    let file_${pcode} = new AV.File('${entity.code.toLowerCase()}_${pcode}_dataUri', { base64: canvas_${pcode}.toDataURL() });
    file_${pcode}.set('SourceEntity','${entity.code}');
    file_${pcode}.set('stg',true);
    ${entity.code.toLowerCase()}1.set('${pcode}',file_${pcode});
                `
                break
            case 'double':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.random.number(79) * faker.random.number(31) / 7)`
                break
            case 'rate':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.random.number(100))`
                break
            case 'integer':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.random.number(200))`
                break
            case 'object':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.helpers.createCard())`
                break
            case 'email':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.internet.email())`
                break
            case 'phone':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.phone.phoneNumber('138########'))`
                break
            case 'geo':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,new AV.Geo(faker.address.latitude,faker.address.longitude))`
                break
            case 'year':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.date.recent())`
                break
            case 'yearmonth':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.date.recent())`
                break
            case 'date':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.date.recent())`
                break
            case 'datetime':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.date.recent())`
                break
            case 'time':
                str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.date.recent())`
                break
            case 'array':
                //str += `${entity.code.toLowerCase()}1.set('${pcode}' ,faker.date.recent())`
                break
            default:
                {
                    throw new Error("组件：" + com.code + "的属性" + pcode + "未定义类型:" + ptype);
                }
        }
    str = `${str}
        `;
    return str
}

function getrandomimage(fullname, com) {
    // let localurl = path.join(process.cwd(), 'cli', 'init', com.code)
    // let file_url = faker.image.image(360, 360, true)

    // request.head(file_url, function(err, res, body) {
    //     let p = path.join(localurl, fullname + '.g.jpg').toLocaleLowerCase()
    //     console.log('download file:', p)
    //     request(file_url).pipe(fs.createWriteStream(p))
    // })

    // var file = fs.createWriteStream(path.join(localurl, fullname + '.jpg'))

    // http.get(file_url, function(res) {
    //     res.on('data', function(data) {
    //         file.write(data)
    //     }).on('end', function() {
    //         file.end()
    //         console.log(fullname + '.jpg downloaded to ' + localurl)
    //     })
    // })
    // let rt = path.join(localurl, fullname + '.g.jpg').toLocaleLowerCase().replace(/\\/g, '\\\\')
    // return rt
}

module.exports.gen = gen
    // module.exports.gettestdatabytype = gettestdatabytype