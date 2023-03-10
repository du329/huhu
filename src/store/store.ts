import { createStore, Commit } from 'vuex'
import { get, post, patch, del } from '../utils/request'
import { arrToObj, objToArr } from '../hleps'

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

interface ListProps<P> {
    [key: string]: P
}
export interface GlobalDataProps {
    loading: boolean
    token: string
    user: UserProps
    columnList: {
        data: ListProps<ColumnProps>
        total: number
        currentPage: number
    }
    postList: {
        data: ListProps<PostProps>
        // loadedColumns: Array<string>
        loadedColumns: ListProps<{ total: number, currentPage: number }>
    }
    error: GlobalErrorProps
}

const asyncAndCommit = async (url: string, mutationName: string, commit: Commit,
    method: string = 'get', payload: any = {}, extraData?: string) => {
    let rawData = null
    switch (method) {
        case 'get':
            rawData = await get(url)
            break;
        case 'post':
            rawData = await post(url, payload)
            break;
        case 'patch':
            rawData = await patch(url, payload)
            break;
        case 'delete':
            rawData = await del(url, payload)
            break;
        default:
            break;
    }
    if (extraData) {
        commit(mutationName, { rawData, extraData })
    } else {
        commit(mutationName, rawData)
    }
    return rawData
}

const store = createStore<GlobalDataProps>({
    state: {
        loading: false,
        token: localStorage.getItem('token') || '',
        user: { isLogin: false },
        columnList: { data: {}, total: 0, currentPage: 0 },
        postList: { data: {}, loadedColumns: {} },
        error: { status: false }
    },
    actions: {
        fetchColumns({ state, commit }, params) {
            const { currentPage = 1, pageSize = 6 } = params
            if (state.columnList.currentPage < currentPage) {
                return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
            }
        },
        fetchColumn({ state, commit }, columnId) {
            if (!state.columnList.data[columnId]) {
                return asyncAndCommit(`/columns/${columnId}`, 'fetchColumn', commit)
            }
        },
        fetchPosts({ commit }, params) {
            const { currentPage, pageSize, columnId } = params
            return asyncAndCommit(`/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, 'get', {}, columnId)
        },
        fetchPost({ state, commit }, postId) {
            const currentPost = state.postList.data[postId]
            // postList中post无content
            if (!currentPost || !currentPost.content) {
                return asyncAndCommit(`/posts/${postId}`, 'fetchPost', commit)
            }
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
        fetchCurrentUser(state, { data }) {
            state.user = { isLogin: true, ...data }
        },
        fetchColumns(state, { data }) {
            const { list, count, currentPage } = data
            state.columnList = {
                data: { ...state.columnList.data, ...arrToObj(list) },
                total: count,
                currentPage: currentPage * 1
            }
        },
        fetchColumn(state, { data }) {
            state.columnList.data[data._id] = data
        },
        fetchPosts(state, { rawData: { data }, extraData }) {
            const { count, list, currentPage } = data
            state.postList.data = { ...state.postList.data, ...arrToObj(list) }
            state.postList.loadedColumns[extraData] = { total: count, currentPage }
        },
        fetchPost(state, { data }) {
            state.postList.data[data._id] = data
        },
        // 替换数据
        updatePost(state, { data }) {
            state.postList.data[data._id] = data
        },
        createPost(state, { data }) {
            state.postList.data[data._id] = data
        },
        deletePost(state, { data }) {
            delete state.postList.data[data._id]
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
        getColumnList: (state) => {
            return objToArr(state.columnList.data)
        },

        getCurrentColumn: (state) => (columnId: string) => {
            return state.columnList.data[columnId]
        },

        getPostList: (state) => (columnId: string) => {
            return objToArr(state.postList.data).filter((post) => {
                return post.column === columnId
            })
        },

        getCurrentPost: (state) => (postId: string) => {
            // return state.postList.find(p => p._id === postId)
            return state.postList.data[postId]
        }
    }
})

export default store