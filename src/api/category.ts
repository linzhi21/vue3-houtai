import request from '@/utils/request'

export interface CategoryData {
  id: number,
  name: string,
  category1Id?:number,
  category2Id?:number
}
  

export default {
  // GET /admin/product/getCategory1
  // getCategory1
  getCategory1(){
    return request.get<any,CategoryData[]>('/admin/product/getCategory1')
  },
  // GET /admin/product/getCategory2/{category1Id}
  // getCategory2
  getCategory2(category1Id:number){
    return request.get<any,CategoryData[]>(`/admin/product/getCategory2/${category1Id}`)
  },

  // GET /admin/product/getCategory3/{category2Id}
  getCategory3(category2Id:number){
    return request.get<any,CategoryData[]>(`/admin/product/getCategory3/${category2Id}`)
  }
}