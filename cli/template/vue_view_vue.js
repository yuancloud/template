var common = require('./common')

function gen(com, comlist) {
    let csslist = [];
    let str = `
<template>
<!-- generated on ${new Date().toLocaleString()} -->
  <div class="toplevelcss">
    <v-table title="${com.main.name}"></v-table>
    <div class="containercss">
      <p>${com.main.name}
      <i></i>
      </p>
      <div class="maincss">
        <span @click="edit${com.main.code.toLowerCase()}">编辑</span>
        `
    str += commonVueDiv(com, com.main, comlist);
    str += `
      </div>
    `
    com.sublist.forEach(function(sub) {
        str += `
      <p>${sub.name}
      <i></i>
      </p>
      <div class="subcss">
      <span @click="add${sub.code.toLowerCase()}">添加</span>
      <div v-for="item in uimodel_${sub.code.toLowerCase()}list" class="subitemcss">
        <span @click="edit${sub.code.toLowerCase()}(item.objectId)">编辑</span>`
        str += commonVueDiv(com, sub, comlist, 'item');
        str += `</div>
      </div>`;
    }, this);
    str += `
    </div>
  </div>
</template>

<script>
import tabBar from '../../common/TabBar/tabBar';
import AV from 'leancloud-storage'
export default {
  data() {
    return {
        `
    com.sublist.forEach(function(sub) {
        str += `uimodel_${sub.code.toLowerCase()}list: [],
        `
    }, this);
    str += `uimodel_${com.main.code.toLowerCase()}: {}
    };
  },
  components: {
    'v-table': tabBar
  },
  activated() {
        `
    com.sublist.forEach(function(sub) {
        str += `this.uimodel_${sub.code.toLowerCase()}list=[];
        `
    }, this);
    str += `this.uimodel_${com.main.code.toLowerCase()}={};
    this.init();
  },
  methods: {
    `
    com.sublist.forEach(function(sub) {
        str += `
    edit${sub.code.toLowerCase()}(id) {
      this.$router.push({ name: '${com.main.code.toLowerCase()}/edit_${sub.code.toLowerCase()}/edit.g', query: { subid: id } })
    },
    add${sub.code.toLowerCase()}() {
      this.$router.push({ name: '${com.main.code.toLowerCase()}/edit_${sub.code.toLowerCase()}/edit.g', query: { mainid: this.uimodel_${com.main.code.toLowerCase()}.objectId } })
    },`
    }, this);
    str += `
    edit${com.main.code.toLowerCase()}() {
      this.$router.push({ name: '${com.main.code.toLowerCase()}/edit_${com.code.toLowerCase()}/edit.g', query: { mainid: this.uimodel_${com.main.code.toLowerCase()}.objectId } })
    },
    init() {
      this.objectId = this.$route.query.objectId
      if(!this.objectId) console.log('error:this.$route.query.objectId is null');
      new AV.Query('${com.main.code}').equalTo('objectId', this.objectId)
      .find()
        .then(result => {
          this.uimodel_${com.main.code.toLowerCase()} =this.${com.main.code}_toEntityData(result[0])
        });
        `
    com.sublist.forEach(function(sub) {
        str += `
      new AV.Query('${sub.code}')
      .equalTo('${com.main.code}', AV.Object.createWithoutData('${com.main.code}', this.objectId))
      .find().then((r) => {
        r.map(value => {
          this.uimodel_${sub.code.toLowerCase()}list.push(this.${sub.code}_toEntityData(value))
        });
      })`;
    }, this);
    str += `
},
`
    com.sublist.forEach(function(sub) {
        str += `
        ${sub.code}_toEntityData(e){
      let r = {};
      `
        let commonreturnobj = common.commontoEntityData(com, sub, comlist)
        str += commonreturnobj.str;

        str += `
    console.log(r);
      return r;
    },`
    }, this);
    str += `
${com.main.code}_toEntityData(e){
      let r = {};
      `
    let commonreturnobj = common.commontoEntityData(com, com.main, comlist)
    str += commonreturnobj.str;
    str += `
    console.log(r);
      return r;
    }
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped="true">
@import '../../../common/stylus/viewgStyle.styl'
</style>
            `

    return str
}

function commonVueDiv(com, entity, comlist, item = '') {
    let str = '';
    let enumlist = [];
    let css = '';
    let foritem = item ? item : `uimodel_${entity.code.toLowerCase()}`;
    entity.propertylist.filter(f => !f.type.toLowerCase().startsWith('rd_') && f.code.toLowerCase() != 'createdat' && f.code.toLowerCase() != 'updatedat').forEach((p, index) => {
        if (p.type.trim().toLowerCase().startsWith('ref_')) {
            let reftype = p.type.trim().toLowerCase().substr(4);
            if (reftype == '_user') {
                str += `
              <div class="view_refuser">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}_name}}</span>
              </div> `
                css += ``;
            } else {
                let refcom = comlist.filter(f => f.main.code.toLowerCase() == reftype)[0];
                if (refcom.main_type == 'doc') {
                    str += `
              <div class="view_refdoc">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}_name}}</span>
              </div>
        `
                    css += ``;
                } else if (refcom.main_type == 'order') {
                    str += `
              <div class="view_reforder">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}_name}}</span>
              </div>
        `
                    css += ``;
                }
            }
        } else if (p.type.toLowerCase().startsWith('enum_')) {
            if (p.code == 'state') {
                str += `
              <div class="view_enumstate">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}_name}}</span>
              </div>
            `
                css += ``;
            } else {
                let refenum = {};
                comlist.filter(f => f.enumlist != null && f.enumlist.length > 0).forEach((c, i) => {
                    let refenumlist = c.enumlist.filter(e => p.type.toLowerCase() == 'enum_' + e.code.toLowerCase());
                    if (refenumlist != null && refenumlist.length == 1) {
                        refenum = refenumlist[0];
                        return;
                    }
                }, this);
                enumlist.push(refenum);
                if (refenum) {
                    str += ` 
              <div class="view_enum">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}_name}}</span>
              </div>
            `
                } else {
                    throw new ExceptionInformation("组件：" + com.code + "的属性" + p.code + "未定义类型:" + p.type);
                }
            }
        } else if (p.type.toLowerCase().startsWith('array_')) {
            str += `
            <div class="view_imglist">
            <span>${p.name}1~${Number.parseInt(p.type.split('_').slice(-1)[0])}</span>
            <div>`;
            for (var index = 1; index < Number.parseInt(p.type.split('_').slice(-1)[0]) + 1; index++) {
                str += `<div v-show="${foritem}.${p.code}${index}URL != '../../../../static/img/addto@2x.png'" class="view_imglist_item">
              <img :src="${foritem}.${p.code}${index}URL">
            </div>
                `
            }
            str += `   </div></div>`;

            // } else if (p.code == 'name') {

            // } else if (p.code == 'code') {

            // } else if (p.code == 'orderno') {

        } else { // 普通字段
            switch (p.type.toLowerCase()) {
                case "boolean":
                    {
                        str += `
              <div class="view_boolean">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}_name}}</span>
              </div>
                        `;
                        css += ``;
                        break;
                    }
                case "string":
                    {
                        str += `
              <div class="view_string">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "image":
                    {
                        str += `
              <div class="view_img">
              <span>${p.name}</span>
                <div>
                <img :src="${foritem}.${p.code}URL">
                </div>
              </div>
        `
                        css += ``;
                        break;
                    }
                case "double":
                    {
                        str += `
              <div class="view_double">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "rate":
                    {
                        str += `
              <div class="view_rate">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "integer":
                    {
                        str += `
              <div class="view_integer">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "object":
                    {
                        str += `
              <div class="view_object">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "email":
                    {
                        str += `
              <div class="view_email">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "phone":
                    {
                        str += `
              <div class="view_phone">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "geo":
                    {
                        str += `
              <div class="view_geo">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "year":
                    {
                        str += `
              <div class="view_year">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "yearmonth":
                    {
                        str += `
              <div class="view_yearmonth">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "date":
                    {
                        str += `
              <div class="view_date">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "datetime":
                    {
                        str += `
              <div class="view_datetime">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "time":
                    {
                        str += `
              <div class="view_time">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                case "array":
                    {
                        str += `
              <div class="view_array">
                <span>${p.name}</span>
                <span>{{${foritem}.${p.code}}}</span>
              </div>`;
                        css += ``;
                        break;
                    }
                default:
                    {
                        throw new Error("组件：" + com.code + "的属性" + p.code + "未定义类型:" + p.type);
                    }
            }
        }
    }); //entity.propertylist.forEach

    return str;
}
module.exports.gen = gen