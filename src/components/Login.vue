<template>
	<div>
		<form id="login_form" class="form-signin">
			<img class="mb-4" src="https://getbootstrap.com/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
			<h1 class="h3 mb-3 font-weight-normal" style="text-align: center">请登录</h1>
			<label for="inputUsername" class="sr-only">用户名</label>
			<input v-model="username" name="username" type="text" id="inputUsername" class="form-control" placeholder="用户名"
			 required autofocus>
			<label for="inputPassword" class="sr-only">Password</label>
			<input v-model="password" name="password" type="password" id="inputPassword" class="form-control" placeholder="密码"
			 required>
			<div class="checkbox mb-3" style="text-align: center">
				<label>
					<input name="remember_me" id="remember_me" type="checkbox" value="true"> 记住我
				</label>
			</div>
		</form>
		<button @click="login" id="submit_btn" class="btn btn-lg btn-primary btn-block" type="submit">登陆</button>
		<p class="mt-5 mb-3 text-muted" style="text-align: center">简单留言板系统 &copy; 2017-2018</p>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				username: 'thinkphp',
				password: '123456'
			};
		},
		methods: {
			login() {
				var vm = this
				//console.info(this.username + ' ' + this.password);
				let reqParams = {
					username: vm.username,
					password: vm.password,

				}
				console.info(reqParams)
				vm.$http.post(
					//url
					'/api/BBSDemo/home/user/findUserByUsernameAndPassword',
					//param
					reqParams, {
						//模拟表单提交
						emulateJSON: true
					}, ).then((res) => {
					var data = res.data
					//console.info(data)
					if (data.success == true) {
						//console.info('OK')
						console.info(data.obj[0].user_name + '' + data.obj[0].user_nickname + '' + data.obj[0].user_id)
						this.$http.post(
							'/api/BBSDemo/home/user/confirmLogin', {
								user_id: data.obj[0].user_id,
								user_nickname: data.obj[0].user_nickname
							}, {
								emulateJSON: true
							}
						).then((res) => {
							//如果session写入成功
							if(res.data.msg=='OK'){
								window.location.href="index"; 
							}
							console.info(res.data)
						})
					}
				})
			}
		}
	}
</script>

<style>
	html,
	body {
		height: 100%;
	}

	body {
		display: -ms-flexbox;
		display: -webkit-box;
		display: flex;
		-ms-flex-align: center;
		-ms-flex-pack: center;
		-webkit-box-align: center;
		align-items: center;
		-webkit-box-pack: center;
		justify-content: center;
		padding-top: 40px;
		padding-bottom: 40px;
		background-color: #f5f5f5;
	}

	.form-signin {
		width: 100%;
		max-width: 330px;
		padding: 15px;
		margin: 0 auto;
	}

	.form-signin .checkbox {
		font-weight: 400;
	}

	.form-signin .form-control {
		position: relative;
		box-sizing: border-box;
		height: auto;
		padding: 10px;
		font-size: 16px;
	}

	.form-signin .form-control:focus {
		z-index: 2;
	}

	.form-signin input[type="email"] {
		margin-bottom: -1px;
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}

	.form-signin input[type="password"] {
		margin-bottom: 10px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
</style>
