<template>
	<div class="RefreshNo">
		<div class="box">
			<img :src="test" />
			<p>找不到内容</p>
			<h2>别紧张，试着刷新页面</h2>
		</div>
	</div>
</template>

<script>
	var a = require('./Emptybox@2x.png')
	//console.log(a)
	export default {
		data(){
			return{
				test: a
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.box
		min-height:100%
		background:#f0f0f0
		text-align:center
		img
			margin-top:1.922rem
			height:1.25rem
		p
			font-size:0.17rem	
			padding-top:0.17rem
			color:#767676
		h2
			font-size:0.13rem
			padding-top:0.14rem
			color:#8e8e8e
		
		
</style>