// import axios from 'axios';
import { Message } from 'element-ui';
axios.interceptors.request.use(config => {//请求之前(可以设置token)
    return config;
}, error => {
    Message.error('HTTP请求异常, 检查配置!!');
    return Promise.reject(error);
});
axios.interceptors.response.use(response => {//数据拿到之后
    return response
}, error => {
    Message.error('HTTP请求异常, 检查配置!!');
    return Promise.reject(error.response);;
});
function successfun(res) {//处理后台返回的非200错误
    if (res.status === 200) {
        return res
    } else {
        Message.warning(res.data);
        return res;
    }
}
function errorfun(res) {
    if (res.status != 200) {
        Message.error('HTTP请求异常, 检查配置!!')
        return res;
    }
}
export default {
    request(method, url, headers, params) {
        if (method === 'post' || method === 'patch' || method === 'put') {
            return axios({
                method: method,
                headers: headers,
                url,
                data: params,
                // withCredentials: true,
                timeout: 60000,//响应时间
            }).then(res => {
                return successfun(res);
            }, err => {
                return errorfun(err);
            })
        } else {
            return axios({
                method: method,
                headers: headers,
                url,
                params,
                // withCredentials: true,
                timeout: 60000,
            }).then(res => {
                return successfun(res)
            }, err => {
                return errorfun(err)
            })
        }
    },
    
    // get(url,params){//get请求
    //     return axios({
    //         method:'get',
    //         baseURL:localhosts,
    //         url,
    //         params,
    //         withCredentials: true,
    //         timeout:5000,
    //     }).then(res => {
    //         return successfun(res)
    //     },err => {
    //         return errorfun(err)
    //     })
    // }
    // (delete,put等请求同上)...
}