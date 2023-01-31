import { createRouter, createWebHistory } from 'vue-router'
import { computed } from 'vue'
import Home from './views/Home/Home.vue'
import Login from './views/Login/Login.vue'
import Register from './views/Login/Register.vue'
import ColumnDetail from './views/Home/ColumnDetail.vue'
import CreatePost from './views/Home/CreatePost.vue'
import store from './store'

const routerHistory = createWebHistory()
const routes = [{
    path: '/',
    name: 'home',
    component: Home
}, {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { redireAlreadyLogin: true },
    // beforeEnter: (to: any, from: any, next: any) => {
    //     if (to.meta.redireAlreadyLogin) {
    //         next({ name: 'home' })
    //     }
    // }
}, {
    path: '/register',
    name: 'register',
    component: Register,
}, {
    path: '/columnDetail/:id',
    name: 'columnDetail',
    component: ColumnDetail,
}, {
    path: '/createPost',
    name: 'createPost',
    component: CreatePost,
    meta: { requiredLogin: true }
},]

const router = createRouter({
    history: routerHistory,
    routes
})

// token存在，刷新再次请求用户信息
// bug： 路由跳转错误 (login、createPost)
router.beforeEach((to, from, next) => {
    const isLogin = computed(() => store.state.user.isLogin)

    if (to.meta.requiredLogin && (!isLogin.value)) {
        next({ name: 'login' })
    } else if (to.meta.redireAlreadyLogin && store.state.user.isLogin) {
        next({ name: 'home' })
    } else {
        next()
    }

})


export default router