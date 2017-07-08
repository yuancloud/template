<template>
  <div class="image-select">
    <div class="image-list">
      <div class="image" v-for="(image,index) in imageList">
        <img :src="image" ref="photoImg" alt="图片" @click="goImageDetail(index, image)">
        <span class="delete" @click="deletePic(index)">
          <img src="./delete.png" alt="" class="delete_icon">
        </span>
      </div>
      <p class="add-image" ref="photo">+
        <input type="file" @change="imgToBase" />
      </p>
    </div>
  </div>
</template>
<script>
import ctx from 'common/js/front.context.g';
import Item, { ItemQuery, ItemImageFile } from '../../item/model/entity.ex';
import AV from 'leancloud-storage';
export default {
  data() {
    return {
      imageList: [],
      picList: []
    };
  },
  activated() {
  },
  updated() {
    this.getImageList();
  },
  methods: {
    imgToBase(e) {
      const reader = new FileReader()
      const self = this
      reader.readAsDataURL(e.target.files[0])
      reader.onload = function (e) {
        self.imageList.push(this.result)
        const data = { base64: this.result }
        const file = new AV.File('rename', data)
        file.save()
          .then(result => {
            self.picList.push(result)
          })
      }
    },
    addImage() {
      // ctx.getImageFile((result, file) => {
      //   this.imageList.push(result);
      //   let pic = new ItemImageFile('image', file);
      //   this.picList.push(pic);
      //   console.log(this.picList);
      // });
    },
    getImageList() {
      if (ctx.getStorage('image')) {
        this.imageList[ctx.getStorage('image').index] = ctx.getStorage('image').url;
        this.picList[ctx.getStorage('changeImage').index] = ctx.getStorage('image').image;
      }
    },
    goImageDetail(index, pic) {
      console.log(this.picList[index]);
      ctx.setStorage('pic', pic);
      this.$router.push({ name: 'item/view_image_detail_b/image_detail', query: { 'image': this.picList[index], 'index': index } });
    },
    /**
     * 删除图片
     * */
    deletePic(index) {
      this.picList.splice(index, 1);
      this.imageList.splice(index, 1);
      console.log(this.picList);
      console.log(this.imageList);
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .image-select
    width: 100%
    max-height :2rem
    z-index: 1000
    background: #fff
    .image-list
      max-height :2rem
      overflow :hidden
      display :flex
      flex-wrap :wrap
      margin-left:.175rem
      .image
        position:relative
        &>img
          display: block
          float: left
          width: 0.75rem
          height: 0.75rem
          margin-right: .135rem
          margin-bottom :.125rem
          margin-top :.125rem
        .delete
          position: absolute
          top:0
          right:0
          &>img
            width:.2rem
            height: .2rem
      .add-image
        width: 0.75rem;
        height: 0.75rem;
        border: 1px solid #9c4294;
        font-size: 0.7rem;
        margin-bottom: 0.125rem;
        margin-top: 0.125rem;
        position: relative;
        &>input
          width .75rem
          height .75rem
          position absolute
          top 0
          left 0
          opacity 0
</style>
