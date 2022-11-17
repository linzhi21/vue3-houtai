<template>
  <el-form :inline="true"  class="demo-form-inline" :disabled="disabled">
    <el-form-item label="一级分类">
      <el-select v-model="category1Id" placeholder="请选择" @change="handlerCategory1">
        <el-option v-for="(c1, index) in category1List" :key="index" :label="c1.name" :value="c1.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="category2Id" placeholder="请选择" @change="handlerCategory2">
        <el-option v-for="(c2, index) in category2List" :key="index" :label="c2.name" :value="c2.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="category3Id" placeholder="请选择">
        <el-option v-for="(c3, index) in category3List" :key="index" :label="c3.name" :value="c3.id" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
  import { defineComponent} from 'vue';
import { storeToRefs } from 'pinia';
  export default defineComponent({
    name:'CategorySelector',
    // 1、全局注册
    // 2、工具查找组件
    // 3、keep-alive
  })
</script>

<script lang="ts" setup>
  import {onMounted } from 'vue'
  import {useCategoryStore} from '@/stores/category'

  const props = defineProps<{
    disabled:boolean
  }>()

  // 1\挂载完成请求一级分类
  const categoryStore = useCategoryStore()
  // 获取一级分类列表的函数
  const getCategory1List = () => {
    categoryStore.getCategory1List()
  }
  // 一旦挂载完成就去获取1级分类列表
  onMounted(() => {
    getCategory1List()
  })

  // 2\把一级分类列表从pinia当中拿到组件当中
  const {category1List,category1Id,category2Id,category2List,category3Id,category3List} = storeToRefs(categoryStore)

  // 3\选中1级分类的change事件回调
  const handlerCategory1 = (category1Id:number) => {
    // 发请求拿二级的分类列表
    categoryStore.getCategory2List()
  }

  // 4、选中2级分类的change事件回调
  const handlerCategory2 = () => {
    categoryStore.getCategory3List()
  }


</script>

<style lang="less" scoped>
</style>
