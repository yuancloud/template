function gen(com, entity) {
  let str = `
<template>
  <div>
    hello world ${com.code}  ${com.main.name} 
    generated on ${new Date().toLocaleString()}
  </div>
</template>

<script>

export default {
  data() {
    return {};
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>

</style>

            `

  return str
}

module.exports.gen = gen