<template>
	<div>
		欢迎您: {{user_nickname}}
		<span class="glyphicon glyphicon-user" aria-hidden="true"></span>
		<!-- <button @click="controll">Click</button> -->
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
					<tr v-for="article in articles">
						<td>{{article.article_id}}</td>
						<td>{{article.article_title}}</td>
						<!-- <td>{{article.article_content}}</td> -->
						<td>{{article.article_create_time}}</td>
						<td>{{article.user_nickname}}</td>
						<td><button @click="showDetail(article)" type="button" class="btn btn-primary">详情</button></td>
					</tr>
				</tbody>
			</table>
		</div>
		<article-detail :ifShowMe="ifShowArticleDetail" :article="article" @on-close="closeArticleDetailDialog"></article-detail>
	</div>
</template>

<script>
	import ArticleDetail from "./ArticleDetail"

	export default {

		created: function() {
			var vm = this
			vm.$http.get(
				//url
				'/api/BBSDemo/home/user/getUidSession').then((res) => {
				//this.$set('gridData', res.data)
				console.info(res.data)
				this.user_nickname = res.data.obj.user_nickname
			})

			vm.$http.get(
				//url: bbsdemo/home/article/allArticle
				'/api/bbsdemo/home/article/allArticle').then((res) => {
				//this.$set('gridData', res.data)
				console.info(res.data)
				if (res.data.success) {
					this.articles = res.data.obj
				}
				//this.user_nickname = res.data.obj.user_nickname
			})
		},
		data() {
			return {
				articles: [],
				user_nickname: '',
				ifShowArticleDetail: false,
				article: {},
			};
		},
		methods: {
			showArticles() {
				console.info(this.articles)
			},

			showDetail(article) {
				console.info(article)
				this.ifShowArticleDetail = true;
				this.article = article
			},
			controll() {
				console.info('clicked')
				this.ifShowArticleDetail = true;
			},
			closeArticleDetailDialog() {
				this.ifShowArticleDetail = false;

			}
		},
		components: {
			ArticleDetail
		}

	}
</script>

<style>
	.table thead tr th{
		text-align: center;
	}
</style>
