import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import IndexPage from '../components/Index'
Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [{
			path: '/login',
			//redirect: '/login.html'
			component: Login,
			//component: HelloWorld
		},
		{
			path: '/index',
			//redirect: '/login.html'
			component: IndexPage,
			//component: HelloWorld
		},
	]
})
