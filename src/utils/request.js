import Taro from '@tarojs/taro'
import {baseUrl, noConsole} from "../config";

export default (options = {method: 'GET',data: {} }) =>{
  var data = {};

  //输出请求日志
  if (!noConsole){
    console.log(
      `${new Date().toLocaleDateString()}【M=${options.url}】P=${JSON.stringify(data)}`
    );
  }

  return Taro.request({
    url: baseUrl + options.url,
    data: {
      ...data,
    },
    header: {
      'Content-Type': 'application/json',
    },
    method: options.method.toUpperCase(),
  }).then(res => {
    const {statusCode, data} = res;
    if(statusCode >= 200 && statusCode < 300){
      if(!noConsole){
        console.log(
          `${new Date().toLocaleString()}【 M=${options.url} 】【接口响应：】`,
          res
        )
      }
      return data;
    }else {
        Taro.showToast({
          title: '遇到未知错误',
          icon: 'none',
          mask: true,
        });
      console.log(`网络请求状态码${statusCode}`);
    }
  });

}
