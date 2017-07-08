var fs = require('fs')
var path = require('path')
var defaultgroup = '基础设置'

function gen(cwd, comlist) {
    var tar = path.join(cwd, '..', '..', 'src', 'components');
    var menujson = {};
    menujson.datetime = new Date().toLocaleString();
    menujson.menuItemList = [];
    fs.readdirSync(tar).forEach((comdir, index) => {
        if (comdir.toLowerCase() != 'common' && fs.statSync(path.join(tar, comdir)).isDirectory())
            fs.readdirSync(path.join(tar, comdir)).forEach((subdir, index) => {
                if (fs.statSync(path.join(tar, comdir, subdir)).isDirectory())
                    fs.readdirSync(path.join(tar, comdir, subdir)).forEach((file, index) => {
                        if (fs.statSync(path.join(tar, comdir, subdir, file)).isFile() && file.toLowerCase().endsWith('.vue')) {
                            let rt = {};
                            rt.name = file.toLowerCase().replace('.g.vue', '').replace('.vue', '')
                            rt.desc = rt.name;
                            rt.group = defaultgroup;
                            rt.link = path.join(tar, comdir, subdir, file).replace(tar, '').replace(/\\/g, '/').toLowerCase().substring(1);

                            let plist = fs.readFileSync(path.join(tar, comdir, subdir, file), 'utf-8').split('\n')[1].trim().replace('-->', '').split('#')
                            if (plist && plist.length > 1) {
                                for (var index = 1; index < plist.length; index++) {
                                    var element = plist[index];
                                    if (element.trim().split('=')[0] == 'name') {
                                        rt.name = element.trim().split('=')[1];
                                        rt.desc = rt.name;
                                    } else if (element.trim().split('=')[0] == 'desc') {
                                        rt.desc = element.trim().split('=')[1];
                                    } else if (element.trim().split('=')[0] == 'group') {
                                        rt.group = element.trim().split('=')[1];
                                    }
                                }
                                menujson.menuItemList.push(rt)
                            }
                        }
                    });
            });
    });
    menujson.menuItemList.sort((a, b) => {
            if (a.group == defaultgroup) return 1;
            else if (b.group == defaultgroup) return -1;
            else a.group - b.group;
        })
        // comlist.forEach(function(element) {
        //     menujson.menuItemList.find(f => f.com == element.code).group = (element.main.group ? element.main.group : element.main.name);
        // }, this);
    return JSON.stringify(menujson);
}

module.exports.gen = gen