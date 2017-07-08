var common = require('./common')

function gen(com, comlist, ui) {
    let enumcode = ui.tab;
    let isadd = ui.isadd;
    let isop = ui.isop;
    let addurl = ui.addurl ? ui.addurl : `${com.code.toLowerCase()}/edit_${com.main.code.toLowerCase()}/edit.g`;
    let editurl = ui.editurl ? ui.editurl : `${com.code.toLowerCase()}/edit_${com.main.code.toLowerCase()}/edit.g`;

    var enumprop = com.main.propertylist.filter(f => f.code == enumcode)[0]
    if (!enumprop) throw new Error('未找到属性：' + enumcode);

    let rt = common.getEnumInfobyProrperty(com, comlist, enumprop);
    let refenum = rt.refenum
    let statelist = rt.statelist

    let str = `
<template>
<!-- generated on ${new Date().toLocaleString()} -->
  <div class="docList">
    <v-tabbar title="${ui.title}"></v-tabbar>
    <div class="statusBar">
    <div :class="{statusActivity: allcss}" @click.stop="allClick()">全部</div>
    `
    if (statelist)
        statelist.forEach((p, index) => {
            str += `<div :class="{statusActivity: ${p.code}css}" @click.stop="${p.code}Click()">${p.name}</div>
      `
        });
    str += `
        </div>
    <div class="docInfo">
      <div v-for='(item, index) in dataArr'  @click="detailclick(index)">
          <v-listItem :uimodel="item"></v-listItem>
      </div>
    </div>
    `
    if (isadd)
        str += `
       <div class="docAdd">
      <div @click="addclick">添加${com.main.name}</div>
    </div>
    `
    str += `
  </div>
</template>


<script>
import tabBar from '../../common/TabBar/tabBar';
import listItem from './../../common/template/list_docitem';
import AV from 'leancloud-storage'
export default {
  data() {
    return {
      dataArr: [],
      allcss: true,
`
    if (statelist)
        statelist.forEach(function(p, index) {
            str += `${p.code}css:false,
            `
        }, this);
    str += `
    };
  },
  components: {
    'v-tabbar': tabBar,
    'v-listItem': listItem
  },
  activated() {
    this.dataArr = []
    this.allClick()
  },
  methods: {
    detailclick(index) {
      console.log(this.objectId)
      this.$router.push({ name: '${addurl}', query: { mainid: this.dataArr[index].objectId } })
    },`
    if (isadd)
        str += `
    addclick() {
      this.$router.push({ name: '${addurl}' })
    },
    `
    str += `
    allClick() {
      this.dataArr = []
`
    str += getstatecss(com, statelist, 'all')
    str += `
     let query = new AV.Query('${com.main.code}');
      query.descending('updatedAt');
         `
    if (ui.filterlist) {
        ui.filterlist.forEach(function(f) {
            if (f.operator == 'exists') {
                str += `
                query.exists('${f.property}');`;
            } else if (f.operator) {
                str += `
                query.${f.operator}('${f.property}',${f.val});`;
            }
        }, this);
    }
    str += `
      query.find()
        .then(result => {
          for (let i = 0, len = result.length; i < len; i++) {
            this.dataArr.push(this.toentity(result[i]))
          }
        })
    },
`
    if (statelist)
        statelist.forEach((p, index) => {
            str += `${p.code}Click() {
        this.dataArr = []
`
            str += getstatecss(com, statelist, p.code);
            str += `
        const query = new AV.Query('${com.main.code}')
        query.equalTo('${enumcode}', ${p.val})
        `
            if (ui.filter) {
                ui.filter.forEach(function(f) {
                    if (f.operator == 'exists') {
                        str += `
                        query.exists('${f.property}');`;
                    } else if (f.operator) {
                        str += `
                        query.${f.operator}('${f.property}',${f.val});`;
                    }
                }, this);
            }
            str += `
        query.descending('updatedAt')
          .find()
          .then(result => {
            for (let i = 0, len = result.length; i < len; i++) {
              this.dataArr.push(this.toentity(result[i]))
            }
          })
    },
    `
        });
    str += `
    toentity(e){
      let r = {};
      r.objectId = e.get('objectId');
     
      `
    let logo = com.main.propertylist.filter(f => f.code == ui.logo)[0];
    if (!logo) logo = com.main.propertylist.filter(f => f.type == 'Image')[0];
    if (logo) { str += ` 
    r.logoURL =e.get('${logo.code}') ? e.get('${logo.code}').thumbnailURL(200,200): '/static/img/imagenotfound.png';` }

    let headline = com.main.propertylist.filter(f => f.code == ui.headline)[0];
    if (!headline) headline = com.main.propertylist.filter(f => f.code != 'name' && f.code != 'orderno' && f.type == 'String')[0];
    if (headline) {
        temp = getpropertysetrightvalue(com, comlist, headline, `e.get('${headline.code}')`);
        str += `
    r.headline = ${temp};`
    }


    if (ui.contentlist && ui.contentlist.length > 0) {
        str += `
        r.contentlist=[];`;
        ui.contentlist.forEach(function(uic) {
            let p = com.main.propertylist.find(f => f.code == uic.property);
            if (!uic.property_temp) {
                temp = getpropertysetrightvalue(com, comlist, p, `e.get('${uic.property}')`);
                str += `
            r.contentlist.push(${temp});`;
            } else {
                let temp = uic.property_temp;
                tempproperty = getpropertysetrightvalue(com, comlist, p, `e.get('${uic.property}')`)
                    //content{$前有效}
                if (temp.startsWith('$')) {
                    tempstr = temp.replace('$', `${tempproperty} +"`) + '"'; //引号
                } else if (temp.endsWith('$')) {
                    tempstr = '"' + temp.replace('$', `"+${tempproperty}`)
                } else {
                    tempstr = '"' + temp.replace('$', `"+${tempproperty}+"`) + '"'
                }
                str += `
                r.contentlist.push(${tempstr});`;
            }
        }, this);

    }
    title = com.main.propertylist.filter(f => f.code == ui.title)[0];
    if (!title)
        title = com.main.propertylist.find(f => f.code == 'name' || f.code == 'orderno');
    if (title) {
        temp = getpropertysetrightvalue(com, comlist, title, `e.get('${title.code}')`);
        str += `
    r.title = ${temp};`;
    }
    let state = com.main.propertylist.filter(f => f.code == ui.state)[0];
    if (state) {
        let statert = common.getEnumInfobyProrperty(com, comlist, state);
        let pstatelist = statert.statelist;
        //let prefenum = statert.refenum;
        str += `
    r.state = ({`
        pstatelist.forEach((p, index) => {
            str += `${p.val}:'${p.name}',`
        });
        str = str.substr(0, str.length - 1);
        str += `})[e.get('${state.code}')]
            `
    }
    if (isop) {
        str += `
   if(e.get('state'))
    r.uioparr = [`
        com.statemachine.transitionlist.forEach(function(s) {
            str += `
        { fromstate: ${s.fromstateval}, opcode: '${com.main.code}_${s.code}', opname: '${s.name}' },`
        }, this);
        str = str.substr(0, str.length - 1);
        str += `].filter(f=>f.fromstate==e.get('state'));
    `
    }
    str += `
    console.log(r);
      return r;
    }
  }
};
</script>

<style lang="stylus" scoped="true">
.docList
  width 100%
  height 100%
  margin 0
  padding 0
  position relative
  z-index 200
  background-color #fff
  display flex
  flex-direction column
  &>.statusBar
    box-sizing border-box
    padding 0 .18rem
    border-bottom 1px solid #cacaca
    height .5rem
    display flex
    &>div
      height 100%
      flex 1
      color #9f9f9f
      font-size .14rem
      text-align center
      line-height .45rem
      font-weight bold
      float left
    &>:nth-child(n+2)
      margin-left .20rem
    &>.statusActivity
      box-sizing border-box
      color #7a79f1
      border-bottom .02rem solid #7a79f1
  &>.docInfo
      width 100%
      height 100%
      overflow-y auto
      border-top .19rem solid #f5f5f5
      margin-bottom .3rem
  `
    if (isadd) {
        str += `&>.docAdd
    width 100%
    height .4rem
    background-color #f5f5f5
    box-sizing border-box
    border-top .01rem solid #cacaca
    position fixed
    left 0
    bottom 0
    &>div
      width 2rem
      height .3rem
      box-sizing border-box
      border-radius 6px
      color #fff
      background-color #7a79f1
      margin .05rem auto
      line-height .3rem
      font-weight bold`
    }
    str += `
</style>
            `
        //return '';
    return str
}

function getpropertysetrightvalue(com, comlist, p, valstr) {
    if (p.type.toLowerCase().startsWith('enum_')) {
        let statert = common.getEnumInfobyProrperty(com, comlist, p);
        let pstatelist = statert.statelist;
        //let prefenum = statert.refenum;
        str = `
     ({`
        pstatelist.forEach((p, index) => {
            str += `${p.val}:'${p.name}',`
        });
        str = str.substr(0, str.length - 1);
        str += `})[${valstr}]
            `
        return str;
    } else if (p.code == 'state') { throw Error('state暂不支持其他位置显示') } else {
        return valstr;
    }
}



function getstatecss(com, statelist, state) {
    let str = '';
    str += `this.allcss = ${state=='all'?'true':'false'};
    `;
    if (statelist)
        statelist.forEach((p, index) => {
            str += `this.${p.code}css = ${state==p.code?'true':'false'};
      `
        });
    return str;
}
module.exports.gen = gen