import { createRouter, createWebHistory } from 'vue-router'
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
},{
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
router.beforeEach((to, from, next) => {
    // bug：通过url进入login时
    if (to.meta.requiredLogin && !store.state.user.isLogin) {
        next({ name: 'login' })
    } else if (to.meta.redireAlreadyLogin && store.state.user.isLogin) {
        next({ name: 'home' })
    } else {
        next()
    }

})


export default router