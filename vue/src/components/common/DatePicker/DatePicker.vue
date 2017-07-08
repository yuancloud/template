<template>
  <div class="date-picker">
    <div class="picker-title border-1px">
      <span @click="topBtnAction(1)" class="iconfont icon-wrong"></span>
      <h1>服务时间</h1>
      <span @click="topBtnAction(2)">确定</span>
    </div>
    <div class="day-wrapper">
      <ul class="day-list">
        <li class="day-item"
            :class="{active: item.select}"
            v-for="(item, index) in dayList"
            @click="selectServiceDay(index)">{{item.day}}
        </li>
      </ul>
    </div>
    <div class="hour-wrapper">
      <ul class="hour-list">
        <li class="hour-item"
            :disabled="item.disable"
            :class="[{active: item.select, disable: item.disable}]"
            v-for="(item, index) in hourList"
            @click="selectServiceTime(index)">{{item.time}}

        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        dayList: [],
        hourList: [],
        timeStr: '',
        hourStr: '',
        dayStr: '',
        dayNums: [],
        todayIndex: 0
      };
    },
    created() {
      this.getDays();
      this.resetTimeList();
    },
    methods: {
      /**
       * 获取未来几天的日期字符串
       */
      getDays() {
        let dates = [];
        let datestr;
        let weekday;
        let weekdays = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        let myDate = new Date();
        for (let i = 0; i < 6; i++) {
          datestr = Number(myDate.getMonth()) + 1 + '-' + myDate.getDate();
          this.dayNums.push(datestr);
          weekday = myDate.getDay(); // 获得星期几 如：0、1、2、3 number类型
          if (i === 0) {
            datestr = `今天 ${datestr}`;
          } else if (i === 1) {
            datestr = `明天 ${datestr}`;
          } else if (i === 2) {
            datestr = `后天 ${datestr}`;
          } else {
            datestr = `${weekdays[weekday]} ${datestr}`;
          }
          let item = {day: datestr, select: false};
          if (i === 0) {
            item.select = true;
          }
          dates.push(item);
          myDate.setTime(myDate.getTime() + 1000 * 60 * 60 * 24);
        }
        this.dayStr = this.dayNums[0];
        this.dayList = dates;
      },
      resetTimeList() {
        let d = new Date();
        let h = d.getHours();
        let hour = 7;
        for (let i = 0; i < 32; i++) {
          let item = {};
          if (i % 2 === 0) {
            hour += 1;
            if (hour < 10) {
              item.time = `0${hour}:00`;
            } else {
              item.time = `${hour}:00`;
            }
          } else {
            if (hour < 10) {
              item.time = `0${hour}:30`;
            } else {
              item.time = `${hour}:30`;
            }
          }
          if (hour < h + 1) {
            item.disable = true;
          } else {
            item.disable = false;
          }
          item.hour = hour;
          item.select = false;
          this.hourList.push(item);
        }
      },
      /**
       * 选择服务时间（几点）
       * @param positon
       */
      selectServiceTime(positon) {
        this.timeStr = `${this.timeStr}`;
        this.hourList.forEach((item, index) => {
          if (index === positon) {
            this.hourList[index].select = true;
            if (this.todayIndex === 0 && this.hourList[index].disable) {
              return;
            }
            this.hourStr = this.hourList[index].time;
            this.timeStr = `${this.dayStr} ${this.hourStr}`;
            this.$emit('chooseTime', this.timeStr);
          } else {
            this.hourList[index].select = false;
          }
        });
      },
      /**
       * 选择服务日期（那天）
       * @param positon
       */
      selectServiceDay(positon) {
        this.todayIndex = positon;
        this.timeStr = '';
        this.setDisableHour();
        this.dayList.forEach((item, index) => {
          if (index === positon) {
            this.dayList[index].select = true;
            this.dayStr = this.dayNums[index];
            this.hourStr = positon === 0 ? '' : this.hourStr;
            this.timeStr = `${this.dayStr} ${this.hourStr}`;
            this.$emit('chooseTime', this.timeStr);
          } else {
            this.dayList[index].select = false;
          }
        });
      },
      setDisableHour() {
        let d = new Date();
        let h = d.getHours();
        if (this.todayIndex === 0) {
          this.hourList.forEach((item, index) => {
            if (item.hour < h + 1) {
              item.disable = true;
            } else {
              item.disable = false;
            }
          });
        } else {
          this.hourList.forEach((item, index) => {
            item.disable = false;
          });
        }
      },
      topBtnAction(item) {
        this.$emit('pickerAction', item);
//        if (item === 1) {
//          this.$emit('pickerAction');
//        } else {
//          this.$emit('pickerAction', this.timeStr);
//        }
//        this.hourList.forEach((item, index) => {
//          this.hourList[index].select = false;
//        });
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl"
  .date-picker
    position: fixed
    bottom: 0
    left: 0
    z-index: 300
    height: 3rem
    width: 100%
    background: #fff
    .picker-title
      display: flex
      line-height: 0.4rem
      border: 1px solid #f2f2f2
      box-sizing: border-box
      :nth-child(1)
        display: block
        flex: 0 0 0.4rem
        width: 0.4rem
        text-align: center
      :nth-child(2)
        display: block
        flex: 1
        text-align: center
      :nth-child(3)
        display: block
        flex: 0 0 0.4rem
        width: 0.4rem
        font-size: 0.12rem
        color: deepskyblue
    .day-wrapper
      .day-list
        height: 0.4rem
        overflow-x: scroll
        overflow-y: hidden
        white-space: nowrap
        &::-webkit-scrollbar
          display: none
        .day-item
          display: inline-block
          height: 0.4rem
          line-height: 0.4rem
          width: 0.8rem
          text-align: center
          font-size: 0.12rem
          &.active
            color: deepskyblue
            background: #f2f2f2
    .hour-wrapper
      .hour-list
        height: 2.1rem
        padding: 0.05rem 0
        text-align: left
        .hour-item
          display: inline-block
          height: 0.2rem
          width: 0.55rem
          line-height: 0.2rem
          font-size: 0.12rem
          margin: 0.05rem 0.1rem
          box-sizing: border-box
          text-align: center
          border: 1px solid #000
          &.active
            color: deepskyblue
            border: 1px solid deepskyblue
          &.disable
            color: #d0d0d0
            border: 1px solid #d0d0d0
</style>
