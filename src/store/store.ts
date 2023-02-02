import { createStore, Commit } from 'vuex'
import { get, post } from '../utils/request'

// 返回数据
export interface ResponseType<Res = {}> {
    code: number,
    data: Res,
    msg: string
}
export interface ImageProps {
    _id?: string,
    url?: string,
    fitUrl?: string,
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
// 作者
export interface AuthorProps {
    _id: string,
    email: string,
    nickName: string,
    description: string,
    avatar: ImageProps,
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
    author: AuthorProps,
    column: string,
    createdAt: string,
    isHTML?: boolean
}
export interface createPostProps {
    title: string,
    content: string,
    image?: ImageProps | string,
    author: string,
    column: string,
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
// interface CurrentProp{
// }
export interface GlobalDataProps {
    loading: boolean
    token: string
    user: UserProps
    columnList: ColumnProps[]
    postList: {
        currentPost: PostProps | object
        loadedPostList: PostProps[]
    }
    error: GlobalErrorProps
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
    const { data } = await get(url)
    // await new Promise((resovle) => {
    //     setTimeout(resovle, 3000)
    // })
    commit(mutationName, data)
    return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
    const { data } = await post(url, payload)
    commit(mutationName, data)
    return data
}

const store = createStore<GlobalDataProps>({
    state: {
        loading: false,
        token: localStorage.getItem('token') || '',
        user: { isLogin: false },
        columnList: [],
        postList: { currentPost: {}, loadedPostList: [] },
        error: { status: false }
    },
    actions: {
        fetchColumns(content) {
            return getAndCommit('/columns', 'fetchColumns', content.commit)
        },
        fetchPosts({ commit }, columnId) {
            return getAndCommit(`/columns/${columnId}/posts`, 'fetchPosts', commit)
        },
        fetchPost({ commit }, postId) {
            return getAndCommit(`/posts/${postId}`, 'fetchPost', commit)
        },
        createPost({ commit }, payload) {
            return postAndCommit('/posts', 'createPost', commit, payload)
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
        },
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
            state.postList.loadedPostList = rawData.list
        },
        fetchPost(state, rawData) {
            state.postList.currentPost = rawData
        },
        setLoading(state, status) {
            state.loading = status
        },
        createPost(state, payload) {
            state.postList.loadedPostList.push(payload)
        },
        setError(state, error: GlobalErrorProps) {
            state.error = error
        },
        signOut(state) {
            state.token = ''
            localStorage.removeItem('token')
            state.user = { isLogin: false }
        }
    },
    getters: {
        // 返回一个函数
        getColumnById: (state) => (columnId: string) => {
            return state.columnList.find(c => c._id === columnId)
        },

        getCurrentPost: (state) => (postId: string) => {
            // return state.postList.find(p => p._id === postId)
            return state.postList.currentPost
        }
    }
})

export default store