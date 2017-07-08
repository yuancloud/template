var common = require('./common')

function gen(com, comlist) {
    let str = `
<template>
<!-- generated on ${new Date().toLocaleString()} -->
  <div class="toplevelcss">
    <v-table v-show="isShowTabBar" title="${com.main.name}"></v-table>
    <div v-show="isShowTabBar"  class="containercss">
      <p>${com.main.name}
      <i></i>
      </p>
      <div class="maincss">
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
      <div v-for="(item, index) in uimodel_${sub.code.toLowerCase()}list" class="subitemcss">
        <span @click="edit${sub.code.toLowerCase()}(item.objectId)">编辑</span>`
        str += commonVueDiv(com, sub, comlist, 'item');
        str += `</div>
      </div>`;
    }, this);
    str += `
    </div>
     <div class="viewBigPicture" v-show="imgObj.isShowImg">
      <div class='pictureTabBar'>
        <span class="iconfont icon-llmainpageback back" @click="ImggoBack"></span>
        <span class="iconfont icon-lajitong getPicture" @click="deleteImgHandle"></span>
      </div>
      <div class="showImg">
        <img :src="imgObj.imgurl" alt="" class="delete_icon" />
        <input type="file" @change="pop_saveImg" />
      </div>
    </div>

    <div class="refToplevel" v-show="refObj.isShowRef">
      <div class="refContainer">
        <div class="refRecord" v-for="(record, index) in refObj.refuimodel" @click="selectRefRecordHandle(index)">{{record.name}}
          <span v-show="record.isShow" class="iconfont icon-duihao3 selectItem"></span>
        </div>
      </div>
    </div>

    <div class="goEditString" v-show="strObj.isShowStringMark">
      <div class="stringTabBar">
        <span class="iconfont icon-llmainpageback back" @click="ImggoBack"></span>
        <span class="iconfont icon-lajitong getPicture"></span>
      </div>
      <div class="stringContainer">
        <div class="stringInput">
          <input type="text" v-model.lazy.trim="strObj.selectString">
        </div>
        <div class="save">
          <div class="saveHandle" @click="saveStringHandle">保存</div>
        </div>
      </div>
    </div>

    <div class="goEditInt" v-show="intObj.isShowIntMark">
      <div class="intTabBar">
        <span class="iconfont icon-llmainpageback back" @click="ImggoBack"></span>
        <span class="iconfont icon-lajitong getPicture"></span>
      </div>
      <div class="intContainer">
        <div class="intInput">
          <input type="text" v-model.lazy.trim="intObj.selectInt">
        </div>
        <div class="save">
          <div class="saveHandle" @click="saveIntHandle">保存</div>
        </div>
      </div>
    </div>

    <!-- <div class="edit_save" v-show="isShowEditSave">
      <div @click="save_${com.main.code.toLowerCase()}">保存修改</div>
    </div> -->
    `
    com.main.propertylist.filter(f => f.type.toLowerCase().startsWith('boolean')).forEach((p, index) => {
        str += `
        <mt-actionsheet :actions="${p.code}SheetActions" v-model.lazy="isbooleanselect_${p.code}">
        </mt-actionsheet>`;
    });
    com.main.propertylist.filter(f => f.type.toLowerCase().startsWith('enum_') && !f.code.toLowerCase() != 'state').forEach((p, index) => {
        str += `
        <mt-actionsheet :actions="${p.code}sheetActions" v-model.lazy="isenumselect_${p.code}">
        </mt-actionsheet>`;
    });
    com.sublist.forEach(value => {
        value.propertylist.filter(f => f.type.toLowerCase().startsWith('boolean')).forEach((p, index) => {
        str += `
            <mt-actionsheet :actions="${p.code}SheetActions" v-model.lazy="isbooleanselect_${p.code}">
            </mt-actionsheet>`;
        });
    })
    com.sublist.forEach(value => {
        value.propertylist.filter(f => f.type.toLowerCase().startsWith('enum_') && !f.code.toLowerCase() != 'state').forEach((p, index) => {
        str += `
            <mt-actionsheet :actions="${p.code}SheetActions" v-model.lazy="isbooleanselect_${p.code}">
            </mt-actionsheet>`;
        });
    })
    str += `
  </div>
</template>

<script>
import tabBar from '../../common/TabBar/tabBar';
import AV from 'leancloud-storage'
import { Actionsheet, Toast } from 'mint-ui';
import ctx from '../../../common/js/front.context.g'
export default {
  data() {
    return {

      `
    com.main.propertylist.filter(f => f.type.toLowerCase().startsWith('boolean')).forEach((p, index) => {
        str += `
        isbooleanselect_${p.code}:false,
        ${p.code}SheetActions :[],`
    });

    com.sublist.forEach(value => {
        value.propertylist.filter(f => f.type.toLowerCase().startsWith('boolean')).forEach((p, index) => {
        str += `
            isbooleanselect_${p.code}:false,
            ${p.code}SheetActions :[],`
        });
    })

    com.main.propertylist.filter(f => f.type.toLowerCase().startsWith('enum_') && !f.code.toLowerCase() != 'state').forEach((p, index) => {

        let rt = common.getEnumInfobyProrperty(com, comlist, p);
        str += `
        isenumselect_${p.code}:false,
    ${p.code}sheetActions :[],
            `
    com.sublist.forEach(value => {
        value.propertylist.filter(f => f.type.toLowerCase().startsWith('enum_') && !f.code.toLowerCase() != 'state').forEach((p, index) => {
        str += `
            isenumselect_${p.code}:false,
    ${p.code}sheetActions :[],`
        });
    })
    }, this);
    com.main.propertylist.filter(f => f.type.toLowerCase().startsWith('ref_')).forEach(function(ref) {
        str += `refuimodel_${ref.code}:[],//${ref.type} ${ref.name}
       `
    }, this);
    com.sublist.forEach(function(sub) {
        str += `uimodel_${sub.code.toLowerCase()}list: [],
        `
    }, this);
    str += `
            uimodel_${com.main.code.toLowerCase()}: {},
            entity_${com.main.code.toLowerCase()}:{},
            objectId: '',
            imgObj:{isShowImg:false,selectPicture:'',imgurl: ''},
            refObj:{isShowRef:false,refuimodel:[],property:'',popTitle:''},
            strObj: {
                isShowStringMark: false, // 遮罩显示/隐藏
                selectString: '', // 选中项 信息
                selectObjId: '', // 选中项 objectId
                selectField: '', // 选中项 的字段
                selectSubName: '' // 选中项的 字表名
            },
            intObj: {
                isShowIntMark: false, // 遮罩显示/隐藏
                selectInt: '', // 选中项 信息
                selectObjId: '', // 选中项 objectId
                selectField: '', // 选中项 的字段
                selectSubName: '' // 选中项的 字表名
            },
            isShowEditSave: true,
            isShowTabBar: true,
            changeset: {},
            refuimodel:[]
        };
},
components: {
        'v-table': tabBar
    },
    activated() {
       this.objectId = this.$route.query.mainid;
       this.imgObj.isShowImg = false;
       this.refObj.isShowRef = false;
    this.imgObj.selectPicture = '';
    if(this.objectId){
      new AV.Query('${com.main.code}')
        .equalTo('objectId', this.objectId)
        .find()
        .then(result => {
          this.uimodel_${com.main.code.toLowerCase()} = this.toentity_${com.main.code.toLowerCase()}(result[0])
          this.entity_${com.main.code.toLowerCase()} = result[0];
        });
    `
    com.sublist.forEach(function(sub) {
        str += `this.uimodel_${sub.code.toLowerCase()}list = [];
    `
    }, this);

    com.sublist.forEach(function(sub) {
        str += `
      new AV.Query('${sub.code}')
      .equalTo('${com.main.code}', AV.Object.createWithoutData('${com.main.code}', this.objectId))
      .find().then((r) => {
        r.map(value => {
          this.uimodel_${sub.code.toLowerCase()}list.push(this.${sub.code.toLowerCase()}_toentitydata(value))
        });
      })`;
    }, this);

    str += ` 
      }
    else
    {
      this.uimodel_${com.main.code.toLowerCase()} =this.todefaultentity();
    }
    this.refuimodel = [];
    this.changeset = {};
    const self = this
      this.$root.$on('${com.main.code.toLowerCase()}_selectPicture', (result => {
        const field = result.field + 'URL'
        self.uimodel_${com.main.code.toLowerCase()}[field] = result.selectPictureUrl
      }))
`

    com.main.propertylist.filter(f => f.type.toLowerCase().startsWith('boolean')).forEach((p, index) => {
        str += `
        this.isbooleanselect_${p.code}=false;
        this.${p.code}SheetActions=[{
                name: '是',
                method: () => {
                    let entity = AV.Object.createWithoutData('${com.main.code}', this.objectId)
                    entity.set('${p.code}', true)
                    entity.save()
                        .then(result => {
                            this.uimodel_${com.main.code.toLowerCase()}.${p.code}_name = '是'
                            Toast({
                                message: '修改成功',
                                position: 'middle',
                                duration: 1500
                            })
                        })
                }
            },
            {
                name: '否',
                method: () => {
                    let entity = AV.Object.createWithoutData('${com.main.code}', this.objectId)
                    entity.set('${p.code}', false)
                    entity.save()
                        .then(result => {
                            this.uimodel_${com.main.code.toLowerCase()}.${p.code}_name = '否'
                            Toast({
                                message: '修改成功',
                                position: 'middle',
                                duration: 1500
                            })
                        })
                }
            }],`
    });
    com.main.propertylist.filter(f => f.type.toLowerCase().startsWith('enum_') && !f.code.toLowerCase() != 'state').forEach((p, index) => {
        let rt = common.getEnumInfobyProrperty(com, comlist, p);
        str += `
        this.isenumselect_${p.code}=false;

        this.${p.code}sheetActions = [`
        rt.statelist.forEach((l, index) => {
            str += `{name: '${l.name}',method: () => {
                this.uimodel_${com.main.code.toLowerCase()}.${p.code}_name = '${l.name}'
                this.uimodel_${com.main.code.toLowerCase()}.${p.code} = ${l.val}
                let entity = AV.Object.createWithoutData('${com.main.code}', this.objectId)
                entity.set('${p.code}', this.uimodel_${com.main.code.toLowerCase()}.${p.code})
                entity.save().then(result => {
                    Toast({
                        message: '修改成功',
                        position: 'middle',
                        duration: 1500
                    })
                })
                }
            },
                `
        });
        str = str.substr(0, str.length - 1);
        str += `];
            `
    }, this);
    str += `
    },
    methods: {
        `
    if (com.main.propertylist.find(f => f.type.toLowerCase().startsWith('integer'))) {
            str += `
                selectIntegerHandle(field) {
                    this.isShowTabBar = false
                    this.intObj.isShowIntMark = true
                    this.intObj.selectField = field
                    this.intObj.selectSubName = '${com.main.code}'
                    this.intObj.selectObjId = this.objectId
                    this.intObj.selectInt = parseInt(this.uimodel_${com.main.code.toLowerCase()}[field])
                },`
    }

    com.sublist.forEach(value => {
        if (value.propertylist.find(f => f.type.toLowerCase().startsWith('integer'))){
            str += `
                select${value.code.split('_').join('')}IntegerHandle(index, field) {
                    this.isShowTabBar = false
                    this.intObj.isShowIntMark = true
                    this.intObj.selectField = field
                    this.intObj.selectSubName = '${value.code}'
                    this.intObj.selectObjId = this.uimodel_${value.code.toLowerCase()}list[index].objectId
                    this.intObj.selectInt = parseInt(this.uimodel_${value.code.toLowerCase()}list[index][field])
                },`
        }
    });

    if (com.main.propertylist.find(f => f.type.toLowerCase().startsWith('double'))) {
        str += `
            selectDoubleHandle(field) {
                this.isShowTabBar = false
                this.intObj.isShowIntMark = true
                this.intObj.selectField = field
                this.intObj.selectSubName = '${com.main.code}'
                this.intObj.selectObjId = this.objectId
                this.intObj.selectInt = parseFloat(this.uimodel_${com.main.code.toLowerCase()}[field])
            },`
    }
        
    com.sublist.forEach(value => {
        if (value.propertylist.find(f => f.type.toLowerCase().startsWith('double'))) {
                str += `
                    select${value.code.split('_').join('')}DoubleHandle(index, field) {
                        this.isShowTabBar = false
                        this.intObj.isShowIntMark = true
                        this.intObj.selectField = field
                        this.intObj.selectSubName = '${value.code}'
                        this.intObj.selectObjId = this.uimodel_${value.code.toLowerCase()}list[index].objectId
                        this.intObj.selectInt = parseFloat(this.uimodel_${value.code.toLowerCase()}list[index][field])
                    },`
        }
    });

    com.sublist.forEach(value => {
        if (value.propertylist.find(f => f.type.toLowerCase().startsWith('boolean'))){
            str += `
                selectSubBooleanHandle(index, selectClassName, selectFiled) {
                    const booleanStr = 'isbooleanselect_' + selectFiled
                    this[booleanStr] = true
                    const sheetActionStr = selectFiled + 'SheetActions'
                    const currentListItem =  this['uimodel_' + selectClassName.toLowerCase() + 'list'][index]
                    this[sheetActionStr] = [{
                    name: '是',
                    method: () => {
                        let entity = AV.Object.createWithoutData(selectClassName, currentListItem.objectId)
                        entity.set(selectFiled, true)
                        entity.save()
                        .then(result => {
                            currentListItem[selectFiled + '_name'] = '是'
                        })
                    }
                    }, {
                    name: '否',
                    method: () => {
                        let entity = AV.Object.createWithoutData(selectClassName, currentListItem.objectId)
                        entity.set(selectFiled, false)
                        entity.save()
                        .then(result => {
                        currentListItem[selectFiled + '_name'] = '否'
                        })
                    }
                    }]
                },
            `
        }
    });
        str += `
        saveStringHandle() {
            let entity = AV.Object.createWithoutData(this.strObj.selectSubName, this.strObj.selectObjId)
            entity.set(this.strObj.selectField, this.strObj.selectString)
            entity.save()
                .then(result => {
                    console.log(result)
                    if (this.strObj.selectSubName == '${com.main.code}') {
                        let selectUimodelName = 'uimodel_' + (this.strObj.selectSubName).toLowerCase()
                        this[selectUimodelName][this.strObj.selectField] = this.strObj.selectString
                    } else {
                        let selectUimodelName = 'uimodel_' + (this.strObj.selectSubName).toLowerCase() + 'list'
                        let selectSaveObj = this[selectUimodelName].find(n => {
                            return n.objectId == this.strObj.selectObjId
                        })
                        selectSaveObj[this.strObj.selectField] = this.strObj.selectString
                    }  
                    this.strObj.isShowStringMark = false
                    this.isShowTabBar = true
                })
        },

        select${com.main.code.split('_').join('')}Handle(field) {
            this.isShowTabBar = false
            this.strObj.isShowStringMark = true
            this.strObj.selectField = field
            this.strObj.selectSubName = '${com.main.code}'
            this.strObj.selectObjId = this.objectId
            this.strObj.selectString = this.uimodel_${com.main.code.toLowerCase()}[field]
        },
        `
    com.sublist.forEach(function(sub) {
        str += `
            select${sub.code.split('_').join('')}Handle(index, field) {
                this.isShowTabBar = false
                this.strObj.isShowStringMark = true
                this.strObj.selectField = field
                this.strObj.selectSubName = '${sub.code}'
                this.strObj.selectObjId = this.uimodel_${sub.code.toLowerCase()}list[index].objectId
                this.strObj.selectString = this.uimodel_${sub.code.toLowerCase()}list[index][field]
            },
            add${sub.code.toLowerCase()}() {
                this.$router.push({ name: '${com.main.code.toLowerCase()}/edit_${sub.code.toLowerCase()}/edit.g', query: { mainid: this.uimodel_${com.main.code.toLowerCase()}.objectId } })
            },
        `
    }, this);
    if (true) {
        str += `
            saveIntHandle(){
                let entity = AV.Object.createWithoutData(this.intObj.selectSubName, this.intObj.selectObjId)
                entity.set(this.intObj.selectField, parseFloat(this.intObj.selectInt))
                entity.save()
                    .then(result => {
                        console.log(result)
                        if (this.intObj.selectSubName == '${com.main.code}') {
                            let selectUimodelName = 'uimodel_' + (this.intObj.selectSubName).toLowerCase()
                            this[selectUimodelName][this.intObj.selectField] = this.intObj.selectInt
                        } else {
                            let selectUimodelName = 'uimodel_' + (this.intObj.selectSubName).toLowerCase() + 'list'
                            let selectSaveObj = this[selectUimodelName].find(n => {
                                return n.objectId == this.intObj.selectObjId
                            })
                            selectSaveObj[this.intObj.selectField] = this.intObj.selectInt
                        }  
                        this.intObj.isShowIntMark = false
                        this.isShowTabBar = true
                    })
            },
        `
    }
    str += `
    ImggoBack() {
    //   this.isShowEditSave = true
      this.isShowTabBar = true
      this.imgObj.isShowImg = false
      this.refObj.isShowRef = false
      this.strObj.isShowStringMark = false
      this.intObj.isShowIntMark = false
    },
    deleteImgHandle() {
      let entity = AV.Object.createWithoutData('${com.main.code}', this.objectId)
      entity.set(this.imgObj.selectPicture, null)
      //file删除
      entity.save()
        .then(result => {
          this.uimodel_${com.main.code.toLowerCase()}[this.imgObj.selectPicture + 'URL'] = ctx.getAddImg();
          Toast({
            message: '删除成功',
            position: 'middle',
            duration: 1500
          })
          this.isShowEditSave = true
          this.isShowTabBar = true
          this.imgObj.isShowImg = false
        });
    },
    clickPopViewImg(parameter) {
    //   this.imgObj.selectPicture = parameter
    //   this.imgObj.imgurl = this.uimodel_${com.main.code.toLowerCase()}[this.imgObj.selectPicture+'URL']
    //   this.isShowEditSave = false
    //   this.isShowTabBar = false
    //   this.imgObj.isShowImg = true
    this.$router.push({
          name: 'pictureManagement',
          query: {
            className: '${com.main.code}',
            objectId: this.objectId,
            field: parameter
          }
        })
    },
    pop_saveImg(e) {
      const reader = new FileReader()
      const self = this
      const file = e.target.files[0]
      reader.readAsDataURL(file)
      const filename = file.name;
      reader.onload = function (e) {
        self.imgObj.imgurl = this.result;
        self.uimodel_${com.main.code.toLowerCase()}[self.imgObj.selectPicture + 'URL'] = this.result
        const data = { base64: this.result }
        let file = new AV.File('${com.main.code.toLowerCase()}_'+self.imgObj.selectPicture+'_'+filename, data)
        file.set('SourceEntity', '${com.main.code}');
        file.save()
          .then(result => {
            console.log(result)
              let entity = AV.Object.createWithoutData('${com.main.code}', self.objectId)
              entity.set(self.imgObj.selectPicture, result)
              return entity.save()
          })
          .then(data => {
              Toast({
                message: '修改成功',
                position: 'middle',
                duration: 1500
              })
              self.imgObj.isShowImg = false
              self.isShowEditSave = true
              self.isShowTabBar = true
          })
      }
    },
    addchangeset(self,pname, val, orignval) {
      console.log('orign:' + orignval + ',change:' + val);
      this.changeset[pname] = {
          key: pname,
          val: val,
          orignval: orignval
        }
    },
    load_${com.main.code.toLowerCase()}(){},
    save_${com.main.code.toLowerCase()}(changeset) {
    let entity = AV.Object.createWithoutData('${com.main.code}', this.objectId)
    for (let key in this.changeset) {
        if (this.entity_${com.main.code.toLowerCase()}.get(key) != this.changeset[key].val) {
          entity.set(key, this.changeset[key].val);
        }
      }
    entity.save()
        .then(result => {
        Toast({
            message: '修改成功',
            position: 'middle',
            duration: 1500
        })
        })
    },
        `

    com.sublist.forEach(function(sub) {
        str += `
        ${sub.code.toLowerCase()}_toentitydata(e){
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
    toentity_${com.main.code.toLowerCase()}(e){
      let r = {};
      `
    let commonreturnobj = common.commontoEntityData(com, com.main, comlist, true, 'ctx.getAddImg()')
    str += commonreturnobj.str;
    str += `
      return r;
    },//toentitydata
    todefaultentity() {
        return {`
    com.main.propertylist.forEach((p, index) => {
        if (com.main.rdpropertylist.find(f => f.code == p.code)) return;
        str += common.getDefaultValuebyProrperty(p.type, p.code, p.name, com, comlist);
    });
    str = str.substr(0, str.length - 1);
    str += `
    }
  },
    selectRefRecordHandle(index) {
        this.uimodel_${com.main.code.toLowerCase()}[this.refObj.property+'Id'] = this.refObj.refuimodel[index].objectId ;
        this.uimodel_${com.main.code.toLowerCase()}[this.refObj.property+'_name'] = this.refObj.refuimodel[index].name ;
        this.isShowEditSave = true;
        this.refObj.isShowRef = false;
 },
  `
    com.main.propertylist.filter(f => f.type.toLowerCase().startsWith('ref_')).forEach(function(ref) {
        str += `
        clickpop_${com.main.code.toLowerCase()}_${ref.code}(){
            this.isShowEditSave = false;
            this.refObj.isShowRef = true;
            this.refObj.refuimodel = this.refuimodel_${ref.code};
            this.refObj.property = '${ref.code}';
            this.refObj.popTitle = '${ref.name}';
            if(!this.refuimodel_${ref.code}||this.refuimodel_${ref.code}.length==0){
                 this.load_${com.main.code.toLowerCase()}_${ref.code.toLowerCase()}().then((rlist)=>{
                    rlist.forEach((e,index)=>{
                        this.refuimodel_${ref.code}.push(this.toentity_${ref.type.substr(4)}(e));
                    })
                 });
            }
        },
        //${ref.type.substr(4)}
        load_${com.main.code.toLowerCase()}_${ref.code.toLowerCase()}(){
          return new AV.Query('${ref.type.substr(4)}')
          //todo 过滤条件.equalTo(this.selectByteName, this.uimodel_item[this.editObjectByteName])
          .equalTo('name', this.uimodel_${com.main.code.toLowerCase()}[this.refObj.property + '_name'])
          .find();
        },
        toentity_${ref.type.substr(4)}(e){
            let r = {};
            r.objectId = e.get('objectId');
            r.name = e.get('name');
            return r;
        },

        `
    }, this);
    str += `
    }
}
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped="true">
@import '../../../common/stylus/maingStyle.styl'
</style>
`
    return str
}

function commonVueDiv(com, entity, comlist, item = '') {
    let str = '';
    let enumlist = [];
    let css = '';
    let foritem = item ? item : `uimodel_${entity.code.toLowerCase()}`;
    entity.propertylist.filter(f => !f.type.toLowerCase().startsWith('rd_') && f.code.toLowerCase() != 'createdat' && f.code.toLowerCase() != 'updatedat' &&
        f.code.toLowerCase() != 'createdby' && f.code.toLowerCase() != 'updatedby').forEach((p, index) => {
        if (entity.rdpropertylist.find(f => f.code == p.code)) return;
        if (p.type.trim().toLowerCase().startsWith('ref_')) {
            let reftype = p.type.trim().toLowerCase().substr(4);
            if (reftype == '_user') {
                str += ` <div class = "edit_refuser">
    <span>${ p.name}</span> <input v-model.lazy="${foritem}.${p.code}_name" type = "text">
    </div> `
                css += ``;
            } else {
                let refcom = comlist.filter(f => f.main.code.toLowerCase() == reftype)[0];
                if (refcom.main_type == 'doc') {
                    str += `
              <div class="edit_refdoc">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}_name" @click='clickpop_${entity.code.toLowerCase()}_${p.code}()' type="text">
                <span class="iconfont icon-jiantouyou pointer"></span>
              </div>
        `
                    css += ``;
                } else if (refcom.main_type == 'order') {
                    str += `
              <div class="edit_reforder">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}" @click='clickpop_${entity.code.toLowerCase()}_${p.code}()'  type="text">
                <span class="iconfont icon-jiantouyou pointer"></span>
              </div>
        `
                    css += ``;
                }
            }
        } else if (p.type.toLowerCase().startsWith('enum_')) {
            if (p.code == 'state') {
                str += `
              <div class="edit_enumstate">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}" type="text">
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
              <div class="edit_enum">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}_name" @click="()=>{this.isenumselect_${p.code} = true;}" type="text">
              </div>
            `
                } else {
                    throw new ExceptionInformation("组件：" + com.code + "的属性" + p.code + "未定义类型:" + p.type);
                }
            }
        } else if (p.type.toLowerCase().startsWith('array_image')) {
            str += `
            <div class="edit_imglist">
            <span>${p.name}1~${Number.parseInt(p.type.split('_').slice(-1)[0])}</span>
            <div>`;
            for (var index = 1; index < Number.parseInt(p.type.split('_').slice(-1)[0]) + 1; index++) {
                str += `<div class="edit_imglist_item">
              <img :src="${foritem}.${p.code}${index}URL" @click="clickPopViewImg('${p.code}${index}')">
            </div>
                `
            }
            str += `  </div> </div>`;
        } else if (p.type.toLowerCase().startsWith('array_rate')) {
            str += `
            <div class="edit_ratelist">
            <span>${p.name}1~${Number.parseInt(p.type.split('_').slice(-1)[0])}</span>
            <div>`;
            for (var index = 1; index < Number.parseInt(p.type.split('_').slice(-1)[0]) + 1; index++) {
                str += ` <div class="edit_rate">
                <span>${p.name}</span>
                <input v-model.lazy.number="${foritem}.${p.code}${index}" type="number">
              </div>
                `
            }
            str += `  </div> </div>`;
        } else { // 普通字段
            switch (p.type.toLowerCase()) {
                case "boolean":
                    {

                        if (entity == com.main) {
                            str += `
                                <div class="edit_boolean">
                                    <span>${p.name}</span>
                                    <input v-model.lazy="${foritem}.${p.code}_name"  @click="()=>{this.isbooleanselect_${p.code} = true;}" type="text">
                                </div>`;
                        } else {
                            str += `
                                <div class="edit_boolean">
                                    <span>${p.name}</span>
                                    <input v-model.lazy="${foritem}.${p.code}_name"  @click="selectSubBooleanHandle(index, '${entity.code}', '${p.code}')" type="text">
                                </div>`;
                        }

                        
                        css += ``;
                        break;
                    }
                case "string":
                    {
                        if (entity == com.main) {
                            str += `
                            <div class="edit_string">
                                <span>${p.name}</span>
                                <input @click="select${entity.code.split('_').join('')}Handle('${p.code}')" v-model.lazy.trim="${foritem}.${p.code}"  type="text">
                                <span class="iconfont icon-jiantouyou pointer"></span>
                            </div>`;
                        } else {
                            str += `
                            <div class="edit_string">
                                <span>${p.name}</span>
                                <input @click="select${entity.code.split('_').join('')}Handle(index, '${p.code}')" v-model.lazy.trim="${foritem}.${p.code}"  type="text">
                                <span class="iconfont icon-jiantouyou pointer"></span>
                            </div>`;
                        }


                        css += ``;
                        break;
                    }
                case "image":
                    {
                        str += `
              <div class="edit_img">
              <span>${p.name}</span>
                <div>
                <img :src="${foritem}.${p.code}URL"  @click="clickPopViewImg('${p.code}')">
                </div>
              </div>
        `
                        css += ``;
                        break;
                    }
                case "double":
                    {
                        if (entity == com.main) {
                            str += `
                            <div class="edit_double">
                                <span>${p.name}</span>
                                <input @click="selectDoubleHandle('${p.code}')" v-model.lazy.number="${foritem}.${p.code}" type="number">
                            </div>`;
                        } else {
                            str += `
                            <div class="edit_double">
                                <span>${p.name}</span>
                                <input @click="select${entity.code.split('_').join('')}DoubleHandle(index, '${p.code}')" v-model.lazy.number="${foritem}.${p.code}" type="number">
                            </div>`;
                        }
                        
                        css += ``;
                        break;
                    }
                case "rate":
                    {
                        str += `
              <div class="edit_rate">
                <span>${p.name}</span>
                <input v-model.lazy.number="${foritem}.${p.code}" type="number">
              </div>`;
                        css += ``;
                        break;
                    }
                case "integer":
                    {
                        if (entity == com.main) {
                            str += `
                            <div class="edit_integer">
                                <span>${p.name}</span>
                                <input @click="selectIntegerHandle('${p.code}')" v-model.lazy.number="${foritem}.${p.code}" type="number">
                            </div>`;
                        } else {
                            str += `
                            <div class="edit_integer">
                                <span>${p.name}</span>
                                <input @click="select${entity.code.split('_').join('')}IntegerHandle(index, '${p.code}')" v-model.lazy.number="${foritem}.${p.code}" type="number">
                            </div>`;
                        }
                        css += ``;
                        break;
                    }
                case "object":
                    {
                        str += `
              <div class="edit_object">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}" type="text">
              </div>`;
                        css += ``;
                        break;
                    }
                case "email":
                    {
                        str += `
              <div class="edit_email">
                <span>${p.name}</span>
                <input v-model.lazy.trim="${foritem}.${p.code}" type="email">
              </div>`;
                        css += ``;
                        break;
                    }
                case "phone":
                    {
                        str += `
              <div class="edit_phone">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}" type="tel">
              </div>`;
                        css += ``;
                        break;
                    }
                case "geo":
                    {
                        str += `
              <div class="edit_geo">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}" type="text">
              </div>`;
                        css += ``;
                        break;
                    }
                case "year":
                    {
                        str += `
              <div class="edit_year">
                <span>${p.name}</span>
                <input v-model.lazy.number="${foritem}.${p.code}" type="number">
              </div>`;
                        css += ``;
                        break;
                    }
                case "yearmonth":
                    {
                        str += `
              <div class="edit_yearmonth">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}" type="month">
              </div>`;
                        css += ``;
                        break;
                    }
                case "date":
                    {
                        str += `
              <div class="edit_date">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}" type="date">
              </div>`;
                        css += ``;
                        break;
                    }
                case "datetime":
                    {
                        str += `
              <div class="edit_datetime">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}" type="datetime-local">
              </div>`;
                        css += ``;
                        break;
                    }
                case "time":
                    {
                        str += `
              <div class="edit_time">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}" type="time">
              </div>`;
                        css += ``;
                        break;
                    }
                case "array":
                    {
                        str += `
              <div class="edit_array">
                <span>${p.name}</span>
                <input v-model.lazy="${foritem}.${p.code}" type="text">
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