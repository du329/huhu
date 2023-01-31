import { createStore, Commit } from 'vuex'
import { get, post } from './utils/request'

export interface ResponseType<Res = {}> {
    code: number,
    data: Res,
    msg: string
}
export interface ImageProps {
    _id?: string,
    url?: string,
    createdAt?: string
}
// 专栏
export interface ColumnProps {
    _id: string,
    title: string,
    description: string
    avatar?: ImageProps,
    author: string,
    createdAt: string
}
interface AuthorProps {
    _id: string,
    email: string,
    nickName: string,
    description: string,
    avatar: string,
    column: string,
    createdAt: string
}
// 文章
export interface PostProps {
    _id: string,
    title: string,
    excerpt?: string,
    content: string,
    image?: ImageProps,
    author?: AuthorProps,
    column: string,
    createdAt: string,
}
// user
export interface UserProps {
    isLogin: boolean
    _id?: string
    email?: string
    nickName?: string
    column?: string
}
// 错误
export interface GlobalErrorProps {
    status: boolean
    message?: string
}
// 全局data
export interface GlobalDataProps {
    loading: boolean
    token: string
    user: UserProps
    columnList: ColumnProps[]
    postList: PostProps[]
    error: GlobalErrorProps
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
    const { data } = await get(url)
    // await new Promise((resovle) => {
    //     setTimeout(resovle, 3000)
    // })
    commit(mutationName, data)
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
    const { data } = await post(url, payload)
    commit(mutationName, data)
}

const store = createStore<GlobalDataProps>({
    state: {
        loading: false,
        token: localStorage.getItem('token') || '',
        user: { isLogin: false },
        columnList: [],
        postList: [],
        error: { status: false }
    },
    actions: {
        fetchColumns(content) {
            getAndCommit('/columns', 'fetchColumns', content.commit)
        },
        fetchPosts({ commit }, columnId) {
            getAndCommit(`/columns/${columnId}/posts`, 'fetchPosts', commit)
        },
        login({ commit }, payload) {
            // 需要将Promise返回
            return postAndCommit(`/user/login`, 'login', commit, payload)
        },
        fetchCurrentUser({ commit }) {
            return getAndCommit('/user/current', 'fetchCurrentUser', commit)
        },
        loginAndFetch({ dispatch }, loginData) {
            // login请求获取token，再次请求CurrentUser
            return dispatch('login', loginData).then(() => {
                return dispatch('fetchCurrentUser')
            })
        }
    },
    mutations: {
        login(state, rawData) {
            const { token } = rawData
            state.token = token
            localStorage.setItem('token', token)
            // axios.defaults.headers.common.Authorization = `Bearer ${token}`
        },
        fetchCurrentUser(state, rawData) {
            state.user = { isLogin: true, ...rawData }
        },
        fetchColumns(state, rawData) {
            state.columnList = rawData.list
        },
        fetchPosts(state, rawData) {
            state.postList = rawData.list
        },
        setLoading(state, status) {
            state.loading = status
        },
        createPost(state, payload) {
            state.postList.push(payload)
        },
        setError(state, error: GlobalErrorProps) {
            state.error = error
        },
        signOut(state) {
            localStorage.removeItem('token')
            state.user = { isLogin: false }
        }
    },
    getters: {
        // 返回一个函数
        getColumnById: (state) => (columnId: string) => {
            return state.columnList.find(c => c._id === columnId)
        },


    }
})

export default store