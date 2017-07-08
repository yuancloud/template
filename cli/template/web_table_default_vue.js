var common = require('./common');

function gen(com, comlist) {
    let str = `<template>
  <!--#name=${com.main.name}#group=${com.main.group}#desc=${com.main.name}列表 -->
  <div class="auditList">
   <el-table :data="tableData" border :height="tableHeight" width="100%">
     <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
`
    str += setformproperty(com, comlist);
    str += `  
          </el-form>
        </template>
      </el-table-column>
    
    `;
    str += settableproperty(com, comlist);
    str = str.substr(0, str.lastIndexOf(`width=`)) + `show-overflow-tooltip>
                 </el-table-column>  `
    str +=
        ` 
    </el-table>
        <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
 data() {
    return {
      currentPage: 1,
      pageSize: 20,
      count: 10,
      tableData: [],
      tableHeight: 0
    }
  },
  activated() {
    this.tableData = []
    this.pageSize = 20
    this.count = 10
    this.currentPage = 1
    this.tableHeight = window.innerHeight / 4 * 3
    this.init()
  },
  methods: {
   handleSizeChange(val) {
      console.log(val)
      this.pageSize = val
      console.log()
      this.currentChange()
    },
    currentChange(index) {
      this.tableData = []
      this.currentPage = index
      const query = new AV.Query('${com.main.code}')
        .limit(this.pageSize)
        .skip(this.pageSize * (index - 1))
        .find()
        .then(result => {
          this.tableData = result
        })
    },
    init() {
      const query = new AV.Query('${com.main.code}')
      query.find()
        .then(result => {
          result.forEach(value => {
            console.log(value);
            this.tableData.push(this.toentity(value));
            
          })
        })
      query.count()
        .then(count => {
          this.count = count
        })
    },    
    toentity(e){
      let r = {};
      `
    let commonreturnobj = common.commontoEntityData(com, com.main, comlist)
    str += commonreturnobj.str;
    str += `
    console.log(r);
      return r;
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.demo-table-expand
  background-color #0ff
  .el-form-item
    float left
    width 40%
</style>

            `

    return str
}

function settableproperty(com, comlist) {
    let entity = com.main;
    let str = '';
    entity.propertylist.forEach((p, index) => {
        if (p.type.trim().toLowerCase().startsWith('ref_')) {
            str += `<el-table-column prop="${p.code}Display" label="${p.name}" width="80">
                </el-table-column>  
                `;

        } else if (p.type.toLowerCase().startsWith('enum_')) {
            str += `<el-table-column prop="${p.code}Display" label="${p.name}" width="80">
                </el-table-column>  
                `;
        } else {
            switch (p.type.toLowerCase()) {
                case "boolean":
                    {
                        str += `<el-table-column prop="${p.code}Display" label="${p.name}" width="20">
                </el-table-column>  
                `;
                        break;
                    }

                case "image":
                    {
                        str += `<el-table-column prop="${p.code}Display" label="${p.name}" width="80">
                </el-table-column>  
                `;
                        break;
                    }
                case "string":
                case "double":
                case "rate":
                case "integer":
                case "object":
                case "email":
                case "phone":
                case "geo":
                case "year":
                case "yearmonth":
                case "date":
                case "datetime":
                case "time":
                case "array":
                default:
                    {
                        str += `<el-table-column prop="${p.code}" label="${p.name}" width="80">
                </el-table-column>  
                `;
                        break;
                    }
            }
        }
    }); //entity.propertylist.forEach
    return str;
}

function setformproperty(com, comlist) {
    let entity = com.main;
    let str = '';
    entity.propertylist.forEach((p, index) => {
        if (p.type.trim().toLowerCase().startsWith('ref_')) {
            str += `<el-form-item label="${p.name}">
              <span>{{ props.row.${p.code}Display }}</span>
            </el-form-item> `;

        } else if (p.type.toLowerCase().startsWith('enum_')) {
            str += `<el-form-item label="${p.name}">
              <span>{{ props.row.${p.code}Display }}</span>
            </el-form-item> `;
        } else {
            switch (p.type.toLowerCase()) {
                case "boolean":
                    {
                        str += `<el-form-item label="${p.name}">
              <span>{{ props.row.${p.code}Display }}</span>
            </el-form-item> `;
                        break;
                    }

                case "image":
                    {
                        str += `<el-form-item label="${p.name}">
              <span>{{ props.row.${p.code}Display }}</span>
            </el-form-item> `;
                        break;
                    }
                case "string":
                case "double":
                case "rate":
                case "integer":
                case "object":
                case "email":
                case "phone":
                case "geo":
                case "year":
                case "yearmonth":
                case "date":
                case "datetime":
                case "time":
                case "array":
                default:
                    {
                        str += `<el-form-item label="${p.name}">
              <span>{{ props.row.${p.code} }}</span>
            </el-form-item> `;
                        break;
                    }
            }
        }
    }); //entity.propertylist.forEach
    return str;
}

module.exports.gen = gen