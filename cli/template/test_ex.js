var fs = require('fs');
var url = require('url');
var request = require('request');
var path = require('path')

function gen(com) {
    let str = `// generated on ${new Date().toLocaleString()}
    //import ${com.main.code}, { ${com.main.code}ImageFile, ${com.main.code}Query} from '../../../../../vue/src/components/${com.code}/model/entity.ex';
    import * as common from '../../home/common';
`

    str += `
import AV from 'leancloud-storage';
import faker from 'faker';
import * as test from './test.g';

export default async function execute() {
    let u = await common.login();

    let rt_test_create = await test.create();
    return rt_test_create.rt;

}`;

    return str;
};
module.exports.gen = gen;

// // function gettestdatabytype(type, fullname) {

// //     if (type.trim().toLowerCase().startsWith('ref_')) {
// //         if (type.trim().toLocaleLowerCase() == 'ref_user') {
// //             return "u";
// //         } else {
// //             if (type.trim().toLowerCase().endsWith('[]')) {
// //                 return ` [await require('./../${type.substr(4, type.length - 6)}/init.ex').create(),
//             //              await require('./../${type.substr(4, type.length - 6)}/init.ex').create(),
//             //              await require('./../${type.substr(4, type.length - 6)}/init.ex').create()]`;
//             //             } else
//             //                 return ` await require('./../${type.substr(4)}/init.ex').create()`;
//             //         }
//             //     } else if (type.toLowerCase().startsWith('enum_')) {
//             //         return 'faker.random.number(3)';
//             //     } else if (fullname.toLowerCase().endsWith('code'))
//             //         return `"Test-" + faker.random.number(99999)`;
//             //     else if (fullname.toLowerCase().endsWith('createdby'))
//             //         return `u`;
//             //     else if (fullname.toLowerCase().endsWith('modifiedby'))
//             //         return `u`;
//             //     else if (fullname.toLowerCase().endsWith('name'))
//             //         return `faker.name.findName()`;
//             //     switch (type.toLowerCase()) {
//             //         case "boolean":
//             //             return 'faker.random.boolean()'
//             //         case "string":
//             //             return `"Test_"+faker.random.words()`;
//             //         case "image":
//             //             return `new AV.File('test_${fullname}',fs.readFileSync(\`${getrandomimage(fullname)}\`))`;
//             //         case "double":
//             //             return 'faker.random.number(79) * faker.random.number(31) / 7';
//             //         case "integer":
//             //             return 'faker.random.number(200)';
//             //         case "object":
//             //             return 'faker.random.objectElement()';
//             //         case "email":
//             //             return `faker.internet.email()`;
//             //         case "phone":
//             //             return `faker.phone.phoneNumber('138########')`;
//             //         case "image[]":
//             //             return `[new AV.File('test_${fullname}list-1',fs.readFileSync(\`${getrandomimage(fullname)}\`)),
//             //                     new AV.File('test_${fullname}list-2',fs.readFileSync(\`${getrandomimage(fullname)}\`)),
//             //                     new AV.File('test_${fullname}list-3',fs.readFileSync(\`${getrandomimage(fullname)}\`))]`
//             //         case "geo":
//             //             return `new AV.Geo(${faker.address.latitude},${faker.address.longitude})`
//             //         case "year":
//             //             return `faker.date.recent()`;
//             //         case "yearMonth":
//             //             return `faker.date.recent()`;
//             //         case "date":
//             //             return `faker.date.recent()`;
//             //         case "datetime":
//             //             return `faker.date.recent()`;
//             //         case "time":
//             //             return `faker.date.recent()`;
//             //         default:
//             //             return `faker.random.words()`;
//             //     }
//             // }

//             // function getrandomimage(fullname) {
//             //     let localurl = path.join(process.cwd(), 'cli', 'init', com.code);
//             //     let file_url = faker.image.image(360, 360, true);

//             //     request.head(file_url, function(err, res, body) {
//             //         let p = path.join(localurl, fullname + '.g.jpg').toLocaleLowerCase();
//             //         console.log('download file:', p);
//             //         request(file_url).pipe(fs.createWriteStream(p))
//             //     });

//             //     // var file = fs.createWriteStream(path.join(localurl, fullname + '.jpg'));

//             //     // http.get(file_url, function(res) {
//             //     //     res.on('data', function(data) {
//             //     //         file.write(data);
//             //     //     }).on('end', function() {
//             //     //         file.end();
//             //     //         console.log(fullname + '.jpg downloaded to ' + localurl);
//             //     //     });
//             //     // });
//             //     let rt = path.join(localurl, fullname + '.g.jpg').toLocaleLowerCase().replace(/\\/g, '\\\\');
//             //     return rt;
//             // }


// module.exports.gettestdatabytype = gettestdatabytype;