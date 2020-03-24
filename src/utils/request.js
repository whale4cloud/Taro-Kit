import Taro from '@tarojs/taro'
import {baseUrl, noConsole} from "../config";
import { axios } from 'taro-axios'
import errorCode from './errorCode'

const service = axios.create({
    baseURL: baseUrl,
    timeout: 30000 // 请求超时时间
})

service.defaults.timeout = 30000
// 返回其他状态吗
service.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
service.defaults.withCredentials = true

// HTTPrequest拦截
service.interceptors.request.use(config => {
    const isToken = (config.headers || {}).isToken === false
    let token =  Taro.getStorageSync('access_token');
    if (token && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + token// token
    }
    return config
}, error => {
    return Promise.reject(error)
})


// HTTPresponse拦截
service.interceptors.response.use(res => {
    const status = Number(res.status) || 200
    const message = res.data.msg || errorCode[status] || errorCode['default']
    if (status === 401) {

        return
    }

    if (status !== 200 || res.data.code === 1) {

        return Promise.reject(new Error(message))
    }

    return res
}, error => {
    return Promise.reject(new Error(error))
})

export default service
