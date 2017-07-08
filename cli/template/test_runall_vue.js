var fs = require('fs')
var path = require('path')

function gen(cwd) {
    var tar = path.join(cwd, '..', '..', 'src', 'components');
    var list = [];
    fs.readdirSync(tar).forEach((comdir, index) => {
        if (comdir.toLowerCase() != 'common' && fs.statSync(path.join(tar, comdir)).isDirectory())
            fs.readdirSync(path.join(tar, comdir)).forEach((subdir, index) => {
                if (fs.statSync(path.join(tar, comdir, subdir)).isDirectory())
                    fs.readdirSync(path.join(tar, comdir, subdir)).forEach((file, index) => {
                        if (fs.statSync(path.join(tar, comdir, subdir, file)).isFile() && file.toLowerCase().endsWith('test.ex.js')) {
                            let fstr = '../' + path.join(tar, comdir, subdir, file).replace(tar, '').replace(/\\/g, '/').substring(1);
                            let kstr = fstr.split('/')[1];
                            list.push({ fromstr: fstr, keystr: kstr });
                        }
                    });
            });
    });
    var str = `<template>
  <div class="home">
  `
    list.forEach(function(e) {
        str += `
    <div>============================start==${e.keystr}===================================</div>
    <span>{{rt${e.keystr}}}</span>
    <div>============================end==${e.keystr}===================================</div>
    `;
    }, this);
    str += `
  </div>
</template>
<script>
`
    list.forEach(function(e) {
        str += `
    import  ${e.keystr} from '${e.fromstr}';
     `;
    });
    str += `
  export default {
          data() {
      return {
          `
    list.forEach(function(e) {
        str += `  rt${ e.keystr }: '',`
    }, this);
    str += `
      };
    },
  async  activated() {
      `
    list.forEach(function(e) {
        str += `this.rt${e.keystr}=await ${ e.keystr }();`
    }, this);
    str += `
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>`

    return str
}

module.exports.gen = gen