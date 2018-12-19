<template>
	<div>
		Index page.
		欢迎您:{{user_nickname}}
	</div>
</template>

<script>
	export default {
		created: function() {
			var vm = this
			vm.$http.get(
				//url
				'/api/BBSDemo/home/user/getUidSession').then((res) => {
				//this.$set('gridData', res.data)
				console.info(res.data)
				this.user_nickname=res.data.obj.user_nickname
			})

		},
		data() {
			return {
				user_nickname: '',
			};
		},

	}
</script>

<style>

</style>
