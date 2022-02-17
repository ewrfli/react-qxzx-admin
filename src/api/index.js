import axios from 'axios'
import { message } from 'antd'
import {BrowserRouter} from 'react-router-dom'    
const router = new BrowserRouter()

axios.defaults.timeout = 5000
// axios.defaults.baseURL = '/api'
axios.defaults.baseURL = 'http://127.0.0.1:3002'
//

//http request 请求拦截器
axios.interceptors.request.use(
  config => {
    // const { url } = config;
    config.headers = {
      // 'Content-Type':'application/x-www-form-urlencoded'
    }
    if(localStorage.getItem('adminToken')){ //!url.startsWith('/login') //当请求路径不是这个的时候, 添加token请求头
      //有adminToken 请求带上
      config.headers.Authorization =  'Bearer ' + localStorage.getItem('adminToken');
    } else if(localStorage.getItem('userToken')){ //!url.startsWith('/login') //当请求路径不是这个的时候, 添加token请求头
      //userToken 请求带上
      config.headers.Authorization =  'Bearer ' + localStorage.getItem('userToken');
    }
    return config
  },
  error => {
    message.error('请求出错了， 请稍后重试')
    return Promise.reject(error)
  }
);


//http response 响应拦截器
axios.interceptors.response.use(
  res => {
    const rel = res.data
    console.log('interceptors rel',rel)
    if(rel.code === 433){ 
      localStorage.removeItem('adminToken');
      message.error(rel.msg+'/token失效')
      //当token超时or失效 403账号无权限的时候直接跳转到/login页重新登录
      router.history.push('/login')
    }

    if (rel.code !== 200) {
      message.error(rel.msg)
      return Promise.reject(rel)
    }
    return res
  },
  error => {
    message.error('请求出错了， 请稍后重试')
    return Promise.reject(error)
  }
)

 export default {
    get(url, params = {}) {
      return new Promise((resolve,reject) => {
        axios.get(url, {
          params
        })
        .then(res => {
          resolve(res.data);
        })
      })
    },

    post(url, data = {}){
      return new Promise((resolve,reject) => {
        axios.post(url,data)
          .then(res => {
            resolve(res.data)
          })
      })
    },

    download (url, target = false, fileName = '')  {
      try {
        const downloadEl = document.createElement('a')
        downloadEl.href = url
        if (target) downloadEl.target = '_blank'
        if (fileName) downloadEl.download = fileName
        document.body.appendChild(downloadEl)
        downloadEl.click()
        document.body.removeChild(downloadEl)
      } catch (error) {
        window.open(url)
      }
    }
 }