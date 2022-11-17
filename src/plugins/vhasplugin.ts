// import Vue from 'vue'
// Vue.use() //声明使用插件 本质是调用函数
// // 如果是对象式插件，调用对象的install方法
// // 如果是函数式插件，那么就是直接调用函数
import { useUserInfoStore } from '@/stores/userInfo'
import type { App } from 'vue'
import pinia from '@/stores'
export function myHasPlugin(app: App) {
  // 指令名不带v- 而且必须全小写
  // app.directive('has',(el,bindings) => {
  //   let buttons = useUserInfoStore(pinia).userInfo.buttons
  //   // console.log(el,bindings);
  //   // 判断bindings.value也就是带的按钮的权限数据字符串  v-has带的
  //   // 在不在用户的信息数据当中的buttons里面
  //   // 如果在，代表用户有这个按钮的权限，那么啥也不干
  //   // 如果不再，代表用户没有这个按钮的权限，那么就删除这个按钮
  //   if(!buttons.includes(bindings.value)){
  //     console.log(buttons);

  //     el.parentNode.removeChild(el)
  //   }
  // })

  // 上面的效率低
  app.directive('has', {
    mounted(el, bindings) {
      let buttons = useUserInfoStore(pinia).userInfo.buttons
      // console.log(el,bindings);
      // 判断bindings.value也就是带的按钮的权限数据字符串  v-has带的
      // 在不在用户的信息数据当中的buttons里面
      // 如果在，代表用户有这个按钮的权限，那么啥也不干
      // 如果不再，代表用户没有这个按钮的权限，那么就删除这个按钮
      if (!buttons.includes(bindings.value)) {
        console.log(buttons);

        el.parentNode.removeChild(el)
      }
    },
  })
}
