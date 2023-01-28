import { createStore, Commit } from 'vuex'
import { get, post } from './utils/request'
import { UserProps } from './components/Header/GlobalHeader.vue'

interface ImageProps {
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
// 全局data
export interface GlobalDataProps {
    loading: boolean
    token: string
    user: UserProps
    columnList: ColumnProps[]
    postList: PostProps[],
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
    return data
}

const store = createStore<GlobalDataProps>({
    state: {
        loading: false,
        token: '',
        user: { isLogin: false },
        columnList: [],
        postList: []
    },
    actions: {
        fetchColumns(content) {
            getAndCommit('/columns', 'fetchColumns', content.commit)
        },
        fetchPosts({ commit }, columnId) {
            getAndCommit(`/columns/${columnId}/posts`, 'fetchPosts', commit)
        },
        login({ commit }, payload) {
            return postAndCommit(`/user/login`, 'login', commit, payload)
        }
    },
    mutations: {
        login(state, rawData) {
            state.token = rawData.token
            // state.user = { ...state.user, isLogin: true, name: 'Du', columnId: 1 }
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
    },
    getters: {
        // 返回一个函数
        getColumnById: (state) => (columnId: string) => {
            return state.columnList.find(c => c._id === columnId)
        }
    }
})

export default store