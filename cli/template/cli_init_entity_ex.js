var faker = require('faker')
var com = {}
var fs = require('fs')
var url = require('url')
var request = require('request')
var path = require('path')

function gen(comp) {
    com = comp
    let str = `
    var fs = require('fs')
    var AV = require('leanengine')
    var base = require( './entity.g')
    var faker = require('faker')

     // generated on ${new Date().toLocaleString()}
    /** ${com.main.name} */
    class ${com.main.code} extends base.${com.main.code}Base {
    } 
    `
    com.sublist.forEach(function(sub) {
        str += `    class ${sub.code} extends base.${sub.code}Base {} `
    }, this)
    str += `
    //新增
   async function create() {
        //请确保一下代码可重复执行
    console.log('starting ${com.main.code} init')
    let user = await AV.User.logInWithMobilePhoneSmsCode('18519335090', '056193')
    let u = user.toJSON()
    AV.Object.register(${com.main.code})
`
    com.sublist.forEach(function(sub) {
        str += `AV.Object.register(${sub.code}); `
    }, this)
    str += `
    //新增
    var ${com.main.code.toLowerCase()} = new ${com.main.code}()
    `
    com.main.propertylist.forEach(function(p) {
        if (p.code != 'createdAt' && p.code != 'updatedAt' &&
            p.code != 'createdby' && p.code != 'modifiedby')
            str += `${com.main.code.toLowerCase()}.${p.code} = ${gettestdatabytype(p.type, com.main.code + '_' + p.code)};// ${p.name}
    `
    }, this)
    str += `
    let ${com.main.code.toLowerCase()}2 = await ${com.main.code.toLowerCase()}.save()
    console.log('${com.main.code} save success:' + JSON.stringify(${com.main.code.toLowerCase()}2))
  
`
    com.sublist.forEach(function(sub) {
        str += `  for (var index = 0; index < faker.random.number(3, 6); index++) {
            let ${sub.code.toLowerCase()}1 = new ${sub.code}()
                ${sub.code.toLowerCase()}1.set('${com.main.code}',${com.main.code.toLowerCase()}2)
            `
        sub.propertylist.forEach(function(p) {
            if (p.code != 'createdAt' && p.code != 'updatedAt' &&
                p.code != 'createdby' && p.code != 'modifiedby')
                str += `${sub.code.toLowerCase()}1.${p.code} = ${gettestdatabytype(p.type, com.main.code + '_' + p.code)};// ${p.name}
               `
        }, this)
        str += ` let sub =await ${sub.code.toLowerCase()}1.save()
            console.log('${sub.code} save success:' + JSON.stringify(${sub.code.toLowerCase()}1))
        }`
    }, this)
    str += `
    return ${com.main.code.toLowerCase()}2
    }
    module.exports.create = create
    `
    return str
}

function gettestdatabytype(type, fullname) {
    if (type.trim().toLowerCase().startsWith('ref_')) {
        if (type.trim().toLocaleLowerCase() == 'ref_user') {
            return 'u'
        } else {
            if (type.trim().toLowerCase().endsWith('[]')) {
                return ` [await require('./../${type.substr(4, type.length - 6)}/init.ex').create(),
             await require('./../${type.substr(4, type.length - 6)}/init.ex').create(),
             await require('./../${type.substr(4, type.length - 6)}/init.ex').create()]`
            } else
                return ` await require('./../${type.substr(4)}/init.ex').create()`
        }
    } else if (type.toLowerCase().startsWith('enum_')) {
        return 'faker.random.number(3)'
    } else if (fullname.toLowerCase().endsWith('code'))
        return `"Test-" + faker.random.number(99999)`
    else if (fullname.toLowerCase().endsWith('createdby'))
        return `u`
    else if (fullname.toLowerCase().endsWith('modifiedby'))
        return `u`
    else if (fullname.toLowerCase().endsWith('name'))
        return `faker.name.findName()`
    switch (type.toLowerCase()) {
        case 'boolean':
            return 'faker.random.boolean()'
        case 'string':
            return `"Test_"+faker.random.words()`
        case 'image':
            return `new AV.File('test_${fullname}',fs.readFileSync(\`${getrandomimage(fullname)}\`))`
        case 'double':
            return 'faker.random.number(79) * faker.random.number(31) / 7'
        case 'rate':
            return 'faker.random.number(100)'
        case 'integer':
            return 'faker.random.number(200)'
        case 'object':
            return 'faker.random.objectElement()'
        case 'email':
            return `faker.internet.email()`
        case 'phone':
            return `faker.phone.phoneNumber('138########')`
        case 'image[]':
            return `[new AV.File('test_${fullname}list-1',fs.readFileSync(\`${getrandomimage(fullname)}\`)),
                    new AV.File('test_${fullname}list-2',fs.readFileSync(\`${getrandomimage(fullname)}\`)),
                    new AV.File('test_${fullname}list-3',fs.readFileSync(\`${getrandomimage(fullname)}\`))]`
        case 'geo':
            return `new AV.Geo(${faker.address.latitude},${faker.address.longitude})`
        case 'year':
            return `faker.date.recent()`
        case 'yearMonth':
            return `faker.date.recent()`
        case 'date':
            return `faker.date.recent()`
        case 'datetime':
            return `faker.date.recent()`
        case 'time':
            return `faker.date.recent()`
        default:
            return `faker.random.words()`
    }
}

function getrandomimage(fullname) {
    let localurl = path.join(process.cwd(), 'cli', 'init', com.code)
    let file_url = faker.image.image(360, 360, true)

    request.head(file_url, function(err, res, body) {
        let p = path.join(localurl, fullname + '.g.jpg').toLocaleLowerCase()
        console.log('download file:', p)
        request(file_url).pipe(fs.createWriteStream(p))
    })

    // var file = fs.createWriteStream(path.join(localurl, fullname + '.jpg'))

    // http.get(file_url, function(res) {
    //     res.on('data', function(data) {
    //         file.write(data)
    //     }).on('end', function() {
    //         file.end()
    //         console.log(fullname + '.jpg downloaded to ' + localurl)
    //     })
    // })
    let rt = path.join(localurl, fullname + '.g.jpg').toLocaleLowerCase().replace(/\\/g, '\\\\')
    return rt
}

module.exports.gen = gen
module.exports.gettestdatabytype = gettestdatabytype