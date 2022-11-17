import request from '@/utils/request'

export interface LoginParamsData {
  password: string,
  username: string
} 
interface TokenData  {
  token:string
}

export type UserInfoData = {
  routes: string[],
  buttons: string[],
  roles: string[],
  name: string,
  avatar: string
}




// GET /admin/acl/index/info
// info
const getUserInfo = () => {
  return request.get<any,UserInfoData>('/admin/acl/index/info')
}

// POST /admin/acl/index/login
// login
const userLogin = (loginParams:LoginParamsData) => {
  return request.post<any,TokenData>('/admin/acl/index/login',loginParams)
}

// POST /admin/acl/index/logout
const userLogout = () => {
  return request.post<any,null>('/admin/acl/index/logout')
}

export {
  getUserInfo,
  userLogin,
  userLogout
}





// es模块化
// 无论什么暴露方式出文件的时候都是对象，只是形成对象的方式不同

// 1、默认暴露   一个文件只能有一个
// 默认暴露最终出去的对象是以default为属性，以default后面的值为值的键值对形成的对象
// export default 100
// {
//   default:100
// }
// 引入的时候完整写法是
// import {default as xxx}  from './xxx' 原理
// import xxx from './xxx' 简写


// 2、分别暴露  最终出去也是对象，只是这个对象不需要我们自己封装，系统暴露的时候
// 会自动添加花括号形成对象
// export const a = 100
// export const b = {m:10}
// {
//   a,
//   b
// }
// 引入的时候
// import {a,b} from './xxx'

// 3、统一暴露 最终出去的还是对象，对象是自己写的花括号
// const  a = 100
// const b = [1,2,3]
// export {
//   a,
//   b
// }

// {
//   a,b
// }

// 引入
// import {a,b} from './xxx'


// 4、 直接拿到暴露出来的对象就是xxx  
// import * as xxx from './xxx'


// 5、混合使用
// export const a = 100
// export default [1,2,3]
// {
//   a,
//   default: [1,2,3]
// }
