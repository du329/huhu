import axios from 'axios'
import store from '../store'

//axios实例
const instance = axios.create({
    baseURL: 'http://apis.imooc.com/api',
    headers: {
        'Content-Type': 'application/json'
    },
    // withCredentials: true, //允许跨域携带cookie
    // timeout: 1000,
})

// 请求拦截器
instance.interceptors.request.use(function (config) {
    store.commit('setLoading', true)
    config.params = { ...config.params, icode: 'B95ADA6628189824' }

    // 上传文件，添加到formData中
    if (config.data instanceof FormData) {
        config.data.append('icode', 'B95ADA6628189824')
    } else {
        // 普通的body对象，添加到data中
        config.data = { ...config.data, icode: 'B95ADA6628189824' }
    }
    return config
}, function (err) {
    return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use(function (config) {
    store.commit('setLoading', false)
    return config
}, function (err) {
    return Promise.reject(err)
})

export const get = (url: string, params = {}) => {
    return new Promise((resolve, reject) => {
        instance.get(url, { params }).then((response) => {
            resolve(response.data)
        }, (err) => {
            reject(err)
        })
    })
}

export const post = (url: string, data = {}) => {
    return new Promise((resolve, reject) => {
        instance.post(url, data).then((response) => {
            resolve(response.data)
        }, (err) => {
            reject(err)
        })
    })
}
