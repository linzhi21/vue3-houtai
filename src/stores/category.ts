import {defineStore} from 'pinia'
import categoryApi from '@/api/category'
import { ElMessage } from 'element-plus'
import type {CategoryData} from '@/api/category'

interface CategoryStoreStateData {
  category1List:CategoryData[],
  category1Id:number | string,
  category2List:CategoryData[],
  category2Id:number | string,
  category3List:CategoryData[],
  category3Id:number | string
}

export const useCategoryStore = defineStore('category',{
  state():CategoryStoreStateData{
    return {
      category1List:[],
      category1Id:'',
      category2List:[],
      category2Id:'',
      category3List:[],
      category3Id:''
    }
  },
  actions:{
    async getCategory1List(){
      try {
        const result = await categoryApi.getCategory1()
        this.category1List = result
      } catch (error) {
        ElMessage.error('获取一级分类列表失败')
      }
    },
    async getCategory2List(){
      // 选一级要清空23级
      this.category2Id = ''
      this.category2List = []
      this.category3Id = ''
      this.category3List = []
      try {
        const result = await categoryApi.getCategory2(this.category1Id as number)
        this.category2List = result
      } catch (error) {
        ElMessage.error('获取二级分类列表失败')
      }
    },
    async getCategory3List(){
      // 选二级要清空3级
      this.category3Id = ''
      this.category3List = []
      try {
        const result = await categoryApi.getCategory3(this.category2Id as number)
        this.category3List = result
      } catch (error) {
        ElMessage.error('获取三级分类列表失败')
      }
    },

  }
})