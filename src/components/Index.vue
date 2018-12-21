<template>
	<div>
		欢迎您:
		<!-- : {{user_id}} -->
		<!-- {{pageNow}}{{pageQuantity}} -->
		<span class="glyphicon glyphicon-user" aria-hidden="true"></span> {{user_nickname}}
		<!-- <button class="btn btn-primary" @click="controll">Click</button> -->
		<!-- <button @click="showArticles">显示文章</button> -->
		<br>
		<div class="container">
			<div class="row">
				<div class="col-md-10"> </div>
				<div class="col-md-2">
					<!-- glyphicon glyphicon-pencil -->
					<button type="button" class="btn btn-success" @click="addActicleBtn">
						<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> 发帖</button>
				</div>
			</div>
		</div>
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
						<td>{{timeTrans(article.article_create_time)}}</td>
						<td>{{article.user_nickname}}</td>
						<td><button @click="showDetail(article)" type="button" class="btn btn-primary">详情</button>
							<button @click="deleteArticleConfirm(article)" type="button" class="btn btn-warning">删除</button>
							<button @click="edit(article)" type="button" class="btn btn-primary">修改</button>
						</td>

					</tr>
				</tbody>
			</table>
			<div class="row">
				<nav aria-label="...">
					<ul class="pagination">
						<!-- :class="disabled" -->
						<li @click="jumpPrePage" :class="prePageBtnActive">
							<a href="#" aria-label="Previous">
								<span aria-hidden="true">&laquo;</span>
							</a>
						</li>
						<!-- <li class="active"><a href="#">1 <span class="sr-only">(current)</span></a></li> -->
						<li v-for="(pageSelect,index) in pages" :class="getPageSelect(pageSelect)">
							<a href="#" @click="jumpPage(index+1)">{{pageSelect.pageNumber}}
							</a>
						</li>
						<li @click="jumpPosPage" :class="posPageBtnActive">
							<a href="#" aria-label="Next">
								<span aria-hidden="true">&raquo;</span>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
		
		<!-- 编辑文章用的dialog -->
		<article-detail :ifShowMe="ifShowEditDialog" @on-close="closeEditDialog" :articleReadyToEdit="articleReadyToEdit">
			<p>
				<form class="form-horizontal">
					<div class="form-group">
						<div class="col-sm-10">
							<input v-model="articleReadyToEdit.article_title" type="text" class="form-control" id="inputTitle" placeholder="标题">
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-10">
							<textarea class="form-control" rows="5" v-model="articleReadyToEdit.article_content" placeholder="内容"></textarea>
						</div>
					</div>
				</form>
				<div class="form-group">
					<div class="col-sm-10">
						<button type="submit" class="btn btn-default" @click="updateArticle">
							<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
							更新</button>
					</div>
				</div>
			</p>
		</article-detail>
		
		<!-- 文章详情 -->
		<article-detail :ifShowMe="ifShowArticleDetail" :article="article" @on-close="closeArticleDetailDialog">
			<p>
				<h4><span class="glyphicon glyphicon-align-right" aria-hidden="true"></span>
					{{article.article_title}}
				</h4>
				{{article.article_create_time }}
				作者: {{article.user_nickname }}
				<hr>
				{{article.article_content}}
			</p>
		</article-detail>

		<!-- 发帖的dialog -->
		<article-detail :ifShowMe="ifShowAddArticle" @on-close="closeAddArticleDialog" :inputArticle="inputArticle">
			<p>
				<form class="form-horizontal">
					<div class="form-group">
						<div class="col-sm-10">
							<input v-model="inputArticle.title" type="text" class="form-control" id="inputTitle" placeholder="标题">
						</div>
					</div>
					<!-- <div class="form-group">
						<div class="col-sm-10">
							<input type="text" class="form-control" id="inputContent" placeholder="内容">
						</div>
					</div> -->
					<div class="form-group">
						<div class="col-sm-10">
							<textarea class="form-control" rows="5" v-model="inputArticle.content" placeholder="内容"></textarea>
						</div>
					</div>
				</form>
				<div class="form-group">
					<div class="col-sm-10">
						<button type="submit" class="btn btn-default" @click="addArticle">
							<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
							发表</button>
					</div>
				</div>
			</p>
		</article-detail>

		<delete-confirm-dialog :article="article" :ifShowMe="ifShowDeleteConfirm" @on-close="closeDeleteConfirmDialog">
			<h4>确定要删除么? </h4>
			<button @click="deleteArticle(article)" type="button" class="btn btn-danger">确定</button>
			<!-- <button @click="deleteArticle(article)" type="button" class="btn btn-success">取消</button> -->
		</delete-confirm-dialog>
		{{timeNow}}
	</div>
</template>

<script>
	import ArticleDetail from "./ArticleDetail"
	import TransTime from "../common/time.js"
	import DeleteConfirmDialog from "./dialogs/DeleteConfirmDialog"

	export default {
		//初始化, 调用基本信息, session, 总页数, 获取第一页文章s
		created: function() {
			var vm = this
			//获取用户session, 将来应该是没有session就滚去login页面.
			vm.$http.get(
				//url
				'/api/BBSDemo/home/user/getUidSession').then((res) => {
				//this.$set('gridData', res.data)
				//console.info(res.data)
				this.user_nickname = res.data.obj.user_nickname
				this.user_id = res.data.obj.user_id
				this.inputArticle.user_id = res.data.obj.user_id
			})

			this.getTotalPage()
			this.ajaxArticleByPage(1)

		},

		data() {
			return {
				//当前所有文章的array
				articles: [],
				//session
				user_nickname: '',
				user_id: 0,
				//控制文章详情dialog的开关
				ifShowArticleDetail: false,
				//控制添加文章dialog的开关
				ifShowAddArticle: false,
				//删除确认对话框
				ifShowDeleteConfirm: false,
				//是否显示editdialog的开关
				ifShowEditDialog: false,
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
				//当前的页面信息
				pageNow: {
					pageNumber: 1,
					active: 'active'
				},
				//往前翻页的按钮开关
				prePageBtnActive: 'disabled',
				//往后翻页的按钮
				posPageBtnActive: '',
				//这个类似乎没有用到
				inputArticle: {
					title: '',
					content: '',
					user_id: 0
				},
				articleReadyToDel: {

				},
				articleReadyToEdit: {

				},

			};
		},
		methods: {
			updateArticle(){
				var vm = this
				let reqParam = {
					article_content: this.articleReadyToEdit.article_content,
					article_title: this.articleReadyToEdit.article_title,
					article_id: this.articleReadyToEdit.article_id,
				}
				vm.$http.post(
					'/api/bbsdemo/home/article/updateArticle',
					reqParam, {
						//模拟表单提交
						emulateJSON: true
					}).then((res) => {
					//this.$set('gridData', res.data)
					console.info(res.data)
					if (res.data.success) {
						//console.info(res.data)
						alert('发帖成功')
						this.closeEditDialog()
						//刷新一下
						this.getTotalPage()
						this.ajaxArticleByPage()
					}
				})
			},
			closeEditDialog() {
				this.ifShowEditDialog = false;
			},
			edit(article) {
				//console.info(article.article_id)
				this.articleReadyToEdit = article
				console.info(this.articleReadyToEdit)
				this.ifShowEditDialog = true;
			},
			ajaxAddArticle(article) {
				var vm = this
				let reqParam = {
					article_content: article.article_content,
					article_title: article.article_title,
					author_id: this.user_id
				}
				//获取一下文章列表
				vm.$http.post(
					'/api/bbsdemo/home/article/addArticle',
					reqParam, {
						//模拟表单提交
						emulateJSON: true
					}).then((res) => {
					//this.$set('gridData', res.data)
					console.info(res.data)
					if (res.data.success) {
						//console.info(res.data)
						alert('发帖成功')
						this.closeAddArticleDialog()
						//刷新一下
						this.getTotalPage()
						this.ajaxArticleByPage()
					}
				})
			},
			addActicleBtn() {
				this.ifShowAddArticle = true
				this.inputArticle = {}
			},
			//复用一下, 根据分页获取文章列表.
			ajaxArticleByPage(pageIndex) {
				var vm = this
				let reqParam = {
					page: pageIndex,
					rows: vm.rows,
				}
				//获取一下文章列表
				vm.$http.post(
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
				})
			},
			getTotalPage() {
				var vm = this
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
						}
						pageData[0].active = 'active';
						vm.pages = pageData;
					}
				})
			},
			jumpPrePage() {
				if (this.pageNow.pageNumber > 1) {
					this.jumpPage(this.pageNow.pageNumber - 1);
				}
				this.disablePrePosBtn();
			},
			jumpPosPage() {
				if (this.pageNow.pageNumber < this.pageQuantity) {
					this.jumpPage(this.pageNow.pageNumber + 1);
				}

				this.disablePrePosBtn();

			},
			disablePrePosBtn() {
				if (this.pageNow.pageNumber == this.pageQuantity) {
					this.posPageBtnActive = 'disabled'
				}
				if (this.pageNow.pageNumber == 1) {
					this.prePageBtnActive = 'disabled'
				}
			},
			jumpPage(index) {

				this.ajaxArticleByPage(index);
				for (var i = 0; i < this.pageQuantity; i++) {
					this.pages[i].active = ''
				}
				//注意, 这里传进来的值, 跟数组的index之间还是有差别的, 其实我就应该弄个index传进来.
				this.pages[index - 1].active = 'active'
				this.pageNow = this.pages[index - 1];
				//console.info(this.pageNow);

				this.prePageBtnActive = ''
				this.posPageBtnActive = ''
				this.disablePrePosBtn();
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
			},
			closeAddArticleDialog() {
				this.ifShowAddArticle = false;
			},
			closeDeleteConfirmDialog() {
				this.ifShowDeleteConfirm = false;
			},
			addArticle() {
				//console.info(this.inputArticle.title + ' ' + this.inputArticle.content + ' ' + this.user_id);
				var article = {
					article_content: this.inputArticle.content,
					article_title: this.inputArticle.title,
				}
				this.ajaxAddArticle(article);
			},
			deleteArticleConfirm(article) {
				this.articleReadyToDel = article
				this.ifShowDeleteConfirm = true
			},
			deleteArticle() {
				var vm = this
				let param = {
					article_id: this.articleReadyToDel.article_id,
				}
				console.info('article_id is '.article_id)
				vm.$http.post(
					'/api/bbsdemo/home/article/deleteArticle', param, {
						//模拟表单提交
						emulateJSON: true
					}).then((res) => {
					if (res.data.success) {
						this.refreshPage()
						this.closeDeleteConfirmDialog()
					}
				})
			},
			refreshPage() {
				this.getTotalPage()
				this.ajaxArticleByPage(this.pageNow.pageNumber)
			}
		},
		components: {
			ArticleDetail,
			DeleteConfirmDialog
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
			},
			timeTrans: function(time) {
				return function(time) {
					return TransTime.transTimeFunc.transTime(time)
				}
			},
			timeNow: function() {
				return TransTime.transTimeFunc.getTimeNow()
			},


		}
	}
</script>

<style>
	.table thead tr th {
		text-align: center;
	}
</style>
