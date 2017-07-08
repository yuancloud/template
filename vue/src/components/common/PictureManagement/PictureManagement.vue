<template>
  <div class="pictureManagement">
    <div class="pictureContainer" v-show="isShow">
      <div class="pictureTabBar">
        <span class="iconfont icon-llmainpageback back" @click="picGoBack"></span>
        <span class="uploadPictures">···</span>
        <input type="file" @change="imgToBase" />
      </div>
      <div class="pictureList">
        <div v-for="(item, index) in picturelist" @click="selectPictureHandle(index)">
          <img :src="item.url" alt="占位">
        </div>
      </div>
    </div>
    <div class="pictureMark" v-show="isShowPic">
      <div class="cutPuctureTabBar">
        <span class="iconfont icon-llmainpageback back" @click="cancel"></span>
        <span class="iconfont icon-lajitong deletePicture"></span>
      </div>
      <div class="container" @scroll="imgScrollHandle($event)">
        <div class="bigImgContaienr" ref="bigImgContaienr">
          <img :src="bigImgUrl" alt="" ref='bigImg'>
        </div>
        <div class="editHandle">
          <div @click="cutPicture" v-show='isCanCut'>剪切</div>
          <div @click="save">完成</div>
        </div>
      </div>
    </div>
    <div class="pictureMark" v-show="isShowCut">
      <div class="cutPuctureTabBar">
        <span class="iconfont icon-llmainpageback back" @click="cancel"></span>
        <span class="iconfont icon-lajitong deletePicture"></span>
      </div>
      <div class="container" @scroll="imgScrollHandle($event)">
        <div class="bigImgContaienr" ref="bigImgContaienr">
          <img :src="bigImgUrl" alt="" ref='bigImg'>
        </div>
        <div class="canvas" ref="canvasContainer">
          <canvas ref="canvas"></canvas>
        </div>
        <div class="editHandle">
          <div @click="cancel">取消</div>
          <div @click="cutSave">完成</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AV from 'leancloud-storage'

export default {
  data() {
    return {
      picturelist: [],
      isShow: true,
      isCanCut: false,
      isShowPic: false,
      isShowCut: false,
      bigImgUrl: '',
      getShearBase: '',
      selectImgId: '',
      canvas: {},
      ctx: {},
      img: {},
      deviationX: 0,
      deviationY: 0,
      offsetTop: 0,
      selectIndex: 0
    }
  },
  created() { },
  activated() {
    this.picturelist = []
    this.isShow = true
    this.isCanCut = false
    this.isShowPic = false
    this.isShowCut = false
    this.bigImgUrl = ''
    this.getShearBase = ''
    this.canvas = {}
    this.ctx = {}
    this.img = {}
    this.deviationX = 0
    this.deviationY = 0
    this.offsetTop = 0
    this.initPictureList()
  },
  props: {},
  methods: {
    selectPictureHandle(index) {
      this.isShow = false
      this.isShowPic = true
      this.bigImgUrl = this.picturelist[index].url
      this.$refs.bigImg.width = window.screen.width
      this.selectIndex = index
      let img = new Image()
      img.src = this.picturelist[index].url
      const self = this
      img.onload = () => {
        if (Math.abs((img.width - img.height)) <= 8) {
          self.isCanCut = false
        } else {
          self.isCanCut = true
        }
      }
    },
    imgToBase(e) {
      const reader = new FileReader()
      const self = this
      const filename = e.target.files[0].name
      reader.readAsDataURL(e.target.files[0])
      reader.onload = function (e) {
        self.imageList.push(this.result)
        const data = {
          base64: this.result
        }
        const file = new AV.File(this.$route.query.pictureType + '_' + filename, data)
        file.save()
          .then(result => {
            self.picList.push(result)
          })
      }
    },
    initPictureList() {
      const query = new AV.Query('_File')
      query.startsWith('name', this.$route.query.className.toLowerCase())
        .find()
        .then(result => {
          result.forEach(value => {
            this.picturelist.push(value.toJSON())
          })
        })
    },
    picGoBack() {
      this.$router.go(-1)
    },
    cancel() {
      this.isShow = true
      this.isShowPic = false
      this.isShowCut = false
    },
    cutPicture() {
      this.isShow = false
      this.isShowPic = false
      this.isShowCut = true
    },
    async cutSave() {

      const editFile = await this.canvasInit()
      let entity = AV.Object.createWithoutData(this.$route.query.className, this.$route.query.objectId)
      entity.set(this.$route.query.field, editFile)
        .save()
        .then(result => {
          const emitString = `${this.$route.query.className.toLowerCase()}_selectPicture`
          this.$root.$emit(emitString, {
            field: this.$route.query.field,
            selectPictureUrl: result.toJSON().url
          })
          this.$router.go(-1)
        })
        .catch(err => {
          console.log(err)
        })
    },
    async save() {
      // this.isShow = true
      // _File objId
      const editFile = await new AV.Query('_File').get(this.picturelist[this.selectIndex].objectId)
      let entity = AV.Object.createWithoutData(this.$route.query.className, this.$route.query.objectId)
      entity.set(this.$route.query.field, editFile)
        .save()
        .then(result => {
          const emitString = `${this.$route.query.className.toLowerCase()}_selectPicture`
          this.$root.$emit(emitString, {
            field: this.$route.query.field,
            selectPictureUrl: result.toJSON().url
          })
          this.$router.go(-1)
        })
        .catch(err => {
          console.log(err)
        })
      // const emitString = `${this.$route.query.className.toLowerCase()}_selectPicture`
      // this.$root.$emit(emitString, {
      //   field: this.$route.query.field,
      //   selectPictureUrl: this.picturelist[this.selectIndex].url
      // })
      // this.$router.go(-1)
    },
    imgToBase(e) {
      const reader = new FileReader()
      const self = this
      reader.readAsDataURL(e.target.files[0])
      reader.onload = function (e) {
        self.bigImgUrl = this.result
        self.isShow = false
        self.canvasInit()
      }
    },
    imgScrollHandle(e) {
      this.ctx.clearRect(0, 0, window.screen.width, window.screen.width)
      this.deviationY = e.target.scrollTop + this.offsetTop
      this.drawImage()
    },
    async canvasInit() {
      this.canvas = this.$refs.canvas
      // this.$refs.canvas.width = window.screen.width
      // this.$refs.canvas.height = window.screen.width
      const base = await this.drawImage()
      const data = {
        base64: base
      }
      const fileName = `${this.$route.query.className.toLowerCase()}_${this.$route.query.field}`
      return new AV.File(fileName, data).save()
    },
    drawImage() {
      const self = this
      this.ctx = this.canvas.getContext('2d')
      this.img = new Image()
      this.img.setAttribute('crossOrigin', 'anonymous')
      this.img.src = this.bigImgUrl
      return new Promise((resolve, reject) => {
        this.img.onload = () => {
          const proportionW = self.img.width / window.screen.width
          const proportionH = self.img.height / self.$refs.bigImg.offsetHeight
          self.ctx.drawImage(self.img, self.deviationX, self.deviationY * proportionH, window.screen.width * proportionW, window.screen.width * proportionH, 0, 0, window.screen.width, window.screen.width)
          self.getShearBase = self.canvas.toDataURL()
          if (self.getShearBase) {
            resolve(self.getShearBase)
          } else {
            reject(self.getShearBase)
          }
        }
      })

    }
  },
  mounted() {
    this.$refs.canvasContainer.style.height = window.screen.width + 'px'
    this.$refs.canvasContainer.style.top = '50%'
    this.$refs.bigImgContaienr.style.paddingTop = (window.screen.height - window.screen.width - 88) / 2 + 'px'
    this.$refs.canvasContainer.style.marginTop = -(window.screen.width / 2 + 22) + 'px'
    this.$refs.canvas.width = window.screen.width
    this.$refs.canvas.height = window.screen.width
    this.offsetTop = (window.screen.height - 44 - window.screen.width) / 2
    this.deviationY = this.offsetTop
  },
  deactivated() {
    this.$root.$off(`${this.$route.query.pictureType}_selectPicture`)
  }
}
</script>

<style lang="stylus" scoped="true">
.pictureManagement
  width 100%
  height 100%
  background-color #fff
  display flex
  flex-direction column
  position relative
  z-index 300
  &>.pictureContainer
    &>.pictureTabBar
      width 100%
      height .44rem
      background-color #000
      position relative
      overflow hidden
      &>.back
        color #fff
      &>.uploadPictures
        float right
        color #fff
        font-size .18rem
        font-weight bold
        width .6rem
        height .44rem
        text-align center
        line-height .44rem
      &>input
        position absolute
        top 0
        right 0
        width .6rem
        height .44rem
    &>.pictureList
      width 100%
      flex 1
      overflow-y auto
      box-sizing border-box
      padding .1rem
      padding-bottom .54rem
      &>div
        float left
        width .87rem
        height .87rem
        &>img
          width .8rem
          height .8rem
    &>.handleNavBar
      position fixed
      left 0
      bottom 0
      width 100%
      height .44rem
      background-color #000
      &>div
        width .8rem
        height .44rem
        line-height .44rem
        color #fff
        text-align center
      &>.uploadPictures
        float left
      &>.complete
        float right
  &>.pictureMark
    width 100%
    height 100%
    display flex
    flex-direction column
    background-color #fff
    position relative
    z-index 300
    &>.cutPuctureTabBar
      width 100%
      height .44rem
      background-color #000
      color #fff
      &>.deletePicture
        float right
        color #fff
        font-size .18rem
        font-weight bold
        width .6rem
        height .44rem
        text-align center
        line-height .44rem
    &>.container
      width 100%
      flex 1
      box-sizing border-box
      padding-bottom .44rem
      background-color #000
      overflow auto
      position relative
      &>.bigImgContaienr
        width 100%
        background-color #000
        padding-top 0
        &>img
          width 100%
          opacity .8
      &>.canvas
        position fixed
        left 0
        top 0
        width 100%
        height 0
        box-sizing border-box
        border-top .03rem solid #000
        border-bottom .03rem solid #000
        overflow hidden
      &>.editHandle
        position fixed
        bottom 0
        left 0
        width 100%
        height .44rem
        box-sizing border-box
        border-top .01rem solid #cacaca
        background-color #000
        &>div
          width .6rem
          height .44rem
          text-align center
          line-height .44rem
          color #fff
        &>:nth-child(1)
          float left
        &>:nth-child(2)
          float right
</style>
