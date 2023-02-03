import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home/Home.vue'
import Login from '../views/Login/Login.vue'
import Register from '../views/Login/Register.vue'
import ColumnDetail from '../views/Column/ColumnDetail.vue'
import CreatePost from '../views/Post/CreatePost.vue'
import store from '../store/store'
import PostDetail from '../views/Post/PostDetail.vue'

const routerHistory = createWebHistory()
const routes = [{
    path: '/',
    name: 'home',
    component: Home
}, {
    path: '/login',
    name: 'login',
    component: Login,
    // 已登录、重定向
    meta: { rediretAlreadyLogin: true },
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
    path: '/postDetail/:postId',
    name: 'postDetail',
    component: PostDetail,
},{
    path: '/createPost',
    name: 'createPost',
    component: CreatePost,
    // 需要登录
    meta: { requiredLogin: true }
},]

const router = createRouter({
    history: routerHistory,
    routes
})

// token存在，刷新再次请求用户信息
// bug： 路由跳转错误 (login、createPost)
router.beforeEach((to, from, next) => {
    const { user, token } = store.state
    const { rediretAlreadyLogin, requiredLogin } = to.meta

    // 已登录
    if (user.isLogin) {
        if (rediretAlreadyLogin) { // 重定向?
            next('/')
        } else {
            next()
        }
    } else {
        // token存在
        if (token) { // 请求用户信息
            store.dispatch('fetchCurrentUser').then(() => {
                if (rediretAlreadyLogin) {
                    next('/')
                } else {
                    next()
                }
            }).catch(e => {
                // token过期等,清除信息，重新登录
                console.log(e);
                store.dispatch('signOut')
                next('/login')
            })
        } else { // 判断是否需要登录
            if (requiredLogin) { // 需要登录
                next('/login')
            } else {
                next()
            }
        }
    }

})


export default router