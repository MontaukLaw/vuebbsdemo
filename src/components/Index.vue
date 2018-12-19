<template>
	<div>
		欢迎您: {{user_nickname}}
		<span class="glyphicon glyphicon-user" aria-hidden="true"></span>
		<button class="btn btn-primary" @click="controll">Click</button>
		<!-- <button @click="showArticles">显示文章</button> -->
		<div class="container">
			<table class="table">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th>文章标题</th>
						<!-- <th scope="col">内容</th> -->
						<th>发帖时间</th>
						<th>文章作者</th>
						<th>详情</th>
					</tr>
				</thead>
				<tbody>
					<!-- <tr v-for="article in articles"> -->
					<tr v-for="article in allArticle">
						<td>{{article.article_id}}</td>
						<td>{{article.article_title}}</td>
						<!-- <td>{{article.article_content}}</td> -->
						<td>{{article.article_create_time}}</td>
						<td>{{article.user_nickname}}</td>
						<td><button @click="showDetail(article)" type="button" class="btn btn-primary">详情</button></td>
					</tr>
				</tbody>
			</table>
			<div class="row">
				<nav aria-label="...">
					<ul class="pagination">

						<li class="disabled"><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
						<!-- <li class="active"><a href="#">1 <span class="sr-only">(current)</span></a></li> -->
						<li v-for="(pageSelect,index) in pages" :class="getPageSelect(pageSelect)"><a href="#" @click="jumpPage(index)">{{pageSelect.pageNumber}}</a></li>
						<li>
							<a href="#" aria-label="Next">
								<span aria-hidden="true">&raquo;</span>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
		<article-detail :ifShowMe="ifShowArticleDetail" :article="article" @on-close="closeArticleDetailDialog"></article-detail>
	</div>
</template>

<script>
	import ArticleDetail from "./ArticleDetail"

	export default {

		created: function() {
			var vm = this
			//获取用户session, 将来应该是没有session就滚去login页面.
			vm.$http.get(
				//url
				'/api/BBSDemo/home/user/getUidSession').then((res) => {
				//this.$set('gridData', res.data)
				//console.info(res.data)
				this.user_nickname = res.data.obj.user_nickname
			})

			let reqParam = {
				page: vm.page,
				rows: vm.rows,
			}
			//获取一下文章列表
			vm.$http.post(
				//url: bbsdemo/home/article/allArticle
				'/api/bbsdemo/home/article/allArticle',
				reqParam, {
					//模拟表单提交
					emulateJSON: true
				}).then((res) => {
				//this.$set('gridData', res.data)
				console.info(res.data)
				if (res.data.success) {
					this.articles = res.data.obj
				}
				//this.user_nickname = res.data.obj.user_nickname
			})
			//获取一下文章总数, 用于分页.
			vm.$http.get(
				'/api/bbsdemo/home/article/countArticle',
			).then((res) => {
				console.info(res.data)
				if (res.data.success) {
					vm.total = parseInt(res.data.obj)
					//这里要做一个分页功能啊.
					//var pageQuantity = vm.total / vm.rows;
					var pageData = new Array();
					for (var i = 0; i < this.pageQuantity; i++) {
						pageData.push({
							pageNumber: i + 1,
							url: i + 1 + '',
							active: ''
						})
						//vm.pages[i].pageNumber = i + 1;
						//vm.pages[i].url = i + 1 + '';
					}
					pageData[0].active = 'active';
					//console.info(pageData);
					vm.pages = pageData;
					//console.info(vm.pages);
				}
				//this.user_nickname = res.data.obj.user_nickname
			})

		},
		data() {
			return {
				//当前所有文章的array
				articles: [],
				//session
				user_nickname: '',
				//控制文章详情dialog的开关
				ifShowArticleDetail: false,
				//当前要显示详情的文章
				article: {},
				//当前文章列表页
				page: 1,
				//每页的文章数量
				rows: 5,
				//总文章数, 暂定值
				total: 5,
				//分页对象
				pages: [{
						pageNumber: 1,
						url: '1'
					},
					{
						pageNumber: 2,
						url: '2'
					}
				],
				pageNow: {
					pageNumber: 1,
					active: 'active'
				},

			};
		},
		methods: {
			jumpPage(index) {
				//console.info(url)
				var vm = this
				let reqParam = {
					page: index + 1,
					rows: vm.rows,
				}
				//获取一下文章列表
				vm.$http.post(
					//url: bbsdemo/home/article/allArticle
					'/api/bbsdemo/home/article/allArticle',
					reqParam, {
						//模拟表单提交
						emulateJSON: true
					}).then((res) => {
					//this.$set('gridData', res.data)
					console.info(res.data)
					if (res.data.success) {
						this.articles = res.data.obj
					}
					//this.user_nickname = res.data.obj.user_nickname
				})

				for (var i = 0; i < this.pageQuantity; i++) {
					this.pages[i].active = ''
				}
				//注意, 这里传进来的值, 跟数组的index之间还是有差别的, 其实我就应该弄个index传进来.
				this.pages[index].active = 'active'
				this.pageNow = this.pages[index];
				console.info(this.pageNow);
			},

			showArticles() {
				console.info(this.articles)
			},

			showDetail(article) {
				console.info(article)
				this.ifShowArticleDetail = true;
				this.article = article
			},
			//测试用
			controll() {
				console.info('clicked')
				//测试弹出窗口
				//this.ifShowArticleDetail = true;
				//测试分页
				var vm = this
				let reqParam = {
					page: 2,
					rows: vm.rows,
				}
				//获取一下文章列表
				vm.$http.post(
					//url: bbsdemo/home/article/allArticle
					'/api/bbsdemo/home/article/allArticle',
					reqParam, {
						//模拟表单提交
						emulateJSON: true
					}).then((res) => {
					//this.$set('gridData', res.data)
					//console.info(res.data)
					if (res.data.success) {
						this.articles = res.data.obj
					}
					//this.user_nickname = res.data.obj.user_nickname
				})

			},
			closeArticleDetailDialog() {
				this.ifShowArticleDetail = false;

			}
		},
		components: {
			ArticleDetail
		},
		computed: {
			getArticleID: function() {
				//return article.article_id;
				return 1;
			},
			allArticle: function() {
				return this.articles
			},
			pageQuantity: function() {
				return this.total / this.rows;
			},
			getPageSelect(pageParam) {
				return function(pageParam) {
					//return this.pageNow.active;
					//console.info(xx);
					if (pageParam.pageNumber == this.pageNow.pageNumber) {
						return 'active';
					}
					return '';
				}
			}

		}

	}
</script>

<style>
	.table thead tr th {
		text-align: center;
	}
</style>
