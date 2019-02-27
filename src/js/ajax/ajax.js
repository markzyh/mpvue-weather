import axios from 'axios'

axios.defaults.baseURL = 'https://free-api.heweather.net/s6/weather'
axios.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
}

// 添加请求 拦截器
axios.interceptors.request.use(config => {
  //console.log(config.url)search
  // 在发送请求之前做些什么
  if(config.url.indexOf('location') != -1 || config.url.indexOf('search') != -1){
    let key = `e82fb3f88fdf41898b945fda077cffbc`
    config.url += `&key=${key}`
    return config;
  }else{
    return config
  }
  //config.url = `now?location=${area},${city}&key=${key}`
  
}, error => {
  // 对请求错误做些什么

  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(res => {
  // 对响应数据做点什么
  return res

}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

axios.defaults.adapter = function(config) {
  let baseURL = ``
  //发交易之前显示加载中
  wx.showLoading({ title: '拼命加载中...' })
  //发交易调用(开发放开注释)
  return new Promise((resolve, reject) => {
    //console.log(config);
    wx.request({
      url: baseURL + config.url,
      //data: config.params,
      success: res => {
        //console.log(res)
        if (res.statusCode < 200 || res.statusCode > 300) {
          return reject(res.data || {});
        }
        return resolve(res.data || {});
      },
      complete: res => {
        wx.hideLoading()
        // TODO:
      }
    });
  })
}


export default axios