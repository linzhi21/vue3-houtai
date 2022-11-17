import request from '@/utils/request'


export interface BaseSaleAttrData {
  id: number
  name: string
}

interface SpuSaleAttrValueData {
  id?: number,
  spuId?: number,
  baseSaleAttrId: number | string,
  saleAttrValueName: string | undefined,
  saleAttrName?: string,
  isChecked?: null
}

export type SpuSaleAttrData = {
  id?: number | string,
  spuId?: number | string,
  baseSaleAttrId: number | string,
  saleAttrName: string,
  spuSaleAttrValueList: SpuSaleAttrValueData[],
  isEdit?:boolean,
  saleAttrValueName?:string,
  saleAttrIdValueId?:string
}



export interface SpuImageData {
  id?: number,
  spuId?: number,
  imgName: string,
  imgUrl: string,
  name?:string,
  url?:string,
  response?:any,
  isDefault?:string
}


export interface SpuInfoData {
  id?: number,
  spuName: string,
  description: string
  category3Id: number | string,
  tmId: number | string,
  spuSaleAttrList: SpuSaleAttrData[],
  spuImageList: SpuImageData[]
}

type SpuPageInfoData = {
  records: SpuInfoData[],
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number
}




export default {
  // 获取所有的销售属性列表
  // /admin/product/baseSaleAttrList
  // getBaseSaleAttrList
  getBaseSaleAttrList() {
    return request.get<any, BaseSaleAttrData[]>('/admin/product/baseSaleAttrList')
  },

  // 根据id删除某个spu
  // DELETE /admin/product/deleteSpu/{spuId}
  // deleteSpu
  deleteSpu(spuId: number) {
    return request.delete<any, null>(`/admin/product/deleteSpu/${spuId}`)
  },

  // 获取spu的列表数据，列表当中存储的每个spu信息都是不完整的，只是列表页展示的数据
  // GET /admin/product/{page}/{limit}
  getPageList(page: number, limit: number, category3Id: number) {
    return request.get<any, SpuPageInfoData>(`/admin/product/${page}/${limit}?category3Id=${category3Id}`)
  },

  // 根据id获取某个spu的详情信息
  // GET /admin/product/getSpuById/{spuId}
  // 获取spu基本信息
  getSpuById(spuId: number) {
    return request.get<any, SpuInfoData>(`/admin/product/getSpuById/${spuId}`)
  },
  // 添加和修改spu
  // POST /admin/product/saveSpuInfo
  // saveSpuInfo
  // POST /admin/product/updateSpuInfo
  // 更改spu信息
  addOrUpdate(spu: SpuInfoData) {
    return request.post<any, null>(`/admin/product/${spu.id ? 'updateSpuInfo' : 'saveSpuInfo'}`, spu)
  }


}