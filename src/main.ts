import { createApp } from 'vue'
import pinia from './stores'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import ElSvg from './components/SvgIcon/ElSvg'
import './permission'
import CategorySelector from '@/components/CategorySelector/index.vue'
import {myHasPlugin} from '@/plugins/vhasplugin'

const app = createApp(App)
// app.component('CategorySelector',CategorySelector)
app.component(CategorySelector.name,CategorySelector)

// ElSvg(app)
// myHasPlugin(app)

app.use(ElSvg)
app.use(myHasPlugin)
app.use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')
