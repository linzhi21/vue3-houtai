import { defineStore } from 'pinia'
import { userLogin, getUserInfo, userLogout } from '@/api/userInfo'
import type { LoginParamsData } from '@/api/userInfo'
import { ElMessage } from 'element-plus'
import type { UserInfoData } from '@/api/userInfo'
import {allAsyncRoutes, anyRoute, staticRoutes} from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

interface UserInfoStoreStateData {
  token: string,
  userInfo: UserInfoData,
  menuRoutes:RouteRecordRaw[]
}

// 过滤自己的异步路由
function filterAsyncRoutes(allAsyncRoutes:RouteRecordRaw[],routeNames:string[]){
  let asyncRoutes =  allAsyncRoutes.filter(item => {
    if(routeNames.includes(item.name as string)){

      if(item.children && item.children.length){
        item.children = filterAsyncRoutes(item.children,routeNames)
      }

      return true
    }
  })
  return asyncRoutes
}


// 动态追加注册路由
function addRoutes(routes:RouteRecordRaw[]){
  routes.forEach(item => {
    router.addRoute(item)
  })
}


// 重置路由
function resetRoutes(){
  // 1、把路由器当中所有的路由全部干掉
  let routes = router.getRoutes()
  routes.forEach(item => {
    router.removeRoute(item.name as string)
  })
  // 2、再把static路由全部添加到路由器
  addRoutes(staticRoutes)
}

export const useUserInfoStore = defineStore('userInfo', {
  state(): UserInfoStoreStateData {
    return {
      token: localStorage.getItem('token_key') || '',
      userInfo: {
        routes: [],
        buttons: [],
        roles: [],
        name: '',
        avatar: ''
      },
      menuRoutes:staticRoutes
    }
  },
  actions: {
    // async函数也叫异步函数
    // 函数内部一般都是异步操作，但是不是必须
    // async函数返回值不看return  一定是promise对象
    // 而返回的promise对象的状态要看return

    // return的结果分两大类
    // promise
    // 函数return的promise的状态和async函数返回值的promise状态是一致的
    // 非promise
    // 全部都成功的，除非抛出异常

    // async函数的action当中写不写return和请求返回不返回数据没关系
    // 和组件当中根据请求的成功和失败，有后续的不同操作有关系
    async login(loginParams: LoginParamsData) {
      try {
        const result = await userLogin(loginParams)
        this.token = result.token
        localStorage.setItem('token_key', result.token)
        return 'ok'
      } catch (error) {
        ElMessage.error('登录失败')
        return Promise.reject('failed')
      }
    },

    async getUserInfo() {
      try {
        const result = await getUserInfo()
        this.userInfo = result
        // 根据用户信息当中的routes（字符串数组）及我们刚才配置的所有的异步路由数组
        // 过滤出用户自己的异步路由，动态的添加到路由器
        let asyncRoutes = filterAsyncRoutes(cloneDeep(allAsyncRoutes),result.routes)
        // 过滤出自己的异步路由后，需要使用路由器的api addRoute把自己的异步路由一个一个
        // 放到路由器注册的路由当中
        addRoutes(asyncRoutes.concat(anyRoute))

        // 菜单最后便利的是menuRoutes值产生的,上面动态添加路由,只是让后面生成的菜单，有点击
        // 跳转功能，但是不能显示菜单
        this.menuRoutes = staticRoutes.concat(asyncRoutes,anyRoute)
        return 'ok'
      } catch (error) {
        return Promise.reject('failed')
      }
    },

    // 获取用户信息失败调用可以清空token重新去到登录
    // 退出登录的时候也可以直接调用
    async resetUserInfo() {
      this.token = ''
      localStorage.removeItem('token_key')
      this.userInfo = {
        routes: [],
        buttons: [],
        roles: [],
        name: '',
        avatar: ''
      }
    },

    // 退出登录
    async logout() {
      try {
        await userLogout()
        // 重置路由
        resetRoutes()
        this.resetUserInfo()
        return 'ok'
      } catch (error) {
        return Promise.reject('failed')
      }
    }
  }
})