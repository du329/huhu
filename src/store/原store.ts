import { createStore, Commit } from 'vuex'
import { get, post, patch, del } from '../utils/request'

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

const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, method: string = 'get', payload: any = {}) => {
    let data = null
    switch (method) {
        case 'get':
            data = await get(url)
            break;
        case 'post':
            data = await post(url, payload)
            break;
        case 'patch':
            data = await patch(url, payload)
            break;
        case 'delete':
            data = await del(url, payload)
            break;
        default:
            break;
    }
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
            return asyncAndCommit('/columns', 'fetchColumns', content.commit)
        },
        fetchPosts({ commit }, columnId) {
            return asyncAndCommit(`/columns/${columnId}/posts`, 'fetchPosts', commit)
        },
        fetchPost({ commit }, postId) {
            return asyncAndCommit(`/posts/${postId}`, 'fetchPost', commit)
        },
        createPost({ commit }, payload) {
            return asyncAndCommit('/posts', 'createPost', commit, 'post', payload)
        },
        deletePost({ commit }, postId) {
            return asyncAndCommit(`/posts/${postId}`, 'deletePost', commit, 'delete')
        },
        patchPost({ commit }, { postId, payload }) {
            return asyncAndCommit(`/posts/${postId}`, 'updatePost', commit, 'patch', payload)
        },
        login({ commit }, payload) {
            // 需要将Promise返回
            return asyncAndCommit(`/user/login`, 'login', commit, 'post', payload)
        },
        fetchCurrentUser({ commit }) {
            return asyncAndCommit('/user/current', 'fetchCurrentUser', commit)
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
            state.user = { isLogin: true, ...rawData.data }
        },
        fetchColumns(state, rawData) {
            state.columnList = rawData.data.list
        },
        fetchPosts(state, rawData) {
            state.postList.loadedPostList = rawData.data.list
        },
        fetchPost(state, rawData) {
            state.postList.currentPost = rawData.data
        },
        // 替换数据
        updatePost(state, { data }) {
            state.postList.currentPost = data
            state.postList.loadedPostList = state.postList.loadedPostList.map(post => {
                if (post._id === data._id) {
                    return data
                } else {
                    return post
                }
            })
        },
        createPost(state, { data }) {
            state.postList.loadedPostList.push(data)
        },
        deletePost(state, rawData) {
            state.postList.loadedPostList = state.postList.loadedPostList.filter(post => {
                return post._id !== rawData.data._id
            })
        },
        setLoading(state, status) {
            state.loading = status
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

        // getCurrentPost: (state) => (postId: string) => {
        //     // return state.postList.find(p => p._id === postId)
        //     return state.postList.currentPost
        // }
    }
})

export default store