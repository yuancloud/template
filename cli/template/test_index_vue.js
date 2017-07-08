function gen(com) {
    let str = `
<template>
<!-- generated on ${new Date().toLocaleString()} -->
  <div class="${com.code}">
    <span>{{rt}}</span>
    </div>
</template>

<script>
import execute from './test.ex';
  export default {
    data() {
      return {
        rt: ''
      };
    },
  async  activated() {
      try {
        this.rt = await execute();
      } catch (e) {
        this.rt = e.name + ': ' + e.message;
        console.error(e);
      }
}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>

            `

    return str
}

module.exports.gen = gen