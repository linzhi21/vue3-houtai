import request from '@/utils/request'
import type {SpuImageData,SpuSaleAttrData} from './spu'
export interface SkuImageData {
  id?: number,
  skuId?: number,
  imgName: string,
  imgUrl: string,
  spuImgId: number,
  isDefault: string
}

export interface SkuAttrValueData{
  id?: number,
  attrId: number | string,
  valueId: number | string,
  skuId?: number,
  attrName?: string,
  valueName?: string
}

export interface SkuSaleAttrValueData{
  id?: number,
  skuId?: number,
  spuId?: number,
  saleAttrValueId: number | string,
  saleAttrId: number | string,
  saleAttrName?: string,
  saleAttrValueName?: string
}

export interface  SkuInfoData {
  id?: number,
  spuId: number | string,
  price: number,
  skuName: string,
  skuDesc: string,
  weight: string,
  tmId: number | string,
  category3Id: number | string,
  skuDefaultImg: string,
  isSale?: number,
  createTime?: string,
  skuImageList: SkuImageData[],
  skuAttrValueList: SkuAttrValueData[],
  skuSaleAttrValueList: SkuSaleAttrValueData[]
}



type SkuPageInfoData = {
  records: SkuInfoData[],
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number
}







export default {
  // 下架sku商品
  // GET /admin/product/cancelSale/{skuId}
  // cancelSale
  cancelSale(skuId: number) {
    return request.get<any, null>(`/admin/product/cancelSale/${skuId}`)
  },

  // 根据id删除某个sku
  // DELETE /admin/product/deleteSku/{skuId}
  // deleteSku
  deleteSku(skuId: number) {
    return request.delete<any, null>(`/admin/product/deleteSku/${skuId}`)
  },

  // 根据spu的id查找当前spu里面的所有sku列表
  // GET /admin/product/findBySpuId/{spuId}
  // findBySpuId
  findBySpuId(spuId: number) {
    return request.get<any,SkuInfoData[]>(`/admin/product/findBySpuId/${spuId}`)
  },

  // 根据skuId获取sku的详情信息
  // GET /admin/product/getSkuById/{skuId}
  // getById
  getById(skuId:number){
    return request.get<any,SkuInfoData>(`/admin/product/getSkuById/${skuId}`)
  },
  // 获取sku的分页列表
  // GET /admin/product/list/{page}/{limit}
  // index
  getPageList(page:number,limit:number){
    return request.get<any,SkuPageInfoData>(`/admin/product/list/${page}/${limit}`)
  },

  // 上架sku商品
  // GET /admin/product/onSale/{skuId}
  // onSale
  onSale(skuId:number){
    return request.get<any,null>(`/admin/product/onSale/${skuId}`)
  },

  // 添加sku
  // POST /admin/product/saveSkuInfo
  // saveSkuInfo
  saveSkuInfo(sku:SkuInfoData){
    return request.post<any,null>('/admin/product/saveSkuInfo',sku)
  },

  // 根据spuId获取spu的图片列表
  // GET /admin/product/spuImageList/{spuId}
  // getSpuImageList
  getSpuImageList(spuId:number){
    return request.get<any,SpuImageData[]>(`/admin/product/spuImageList/${spuId}`)
  },

  // 根据spuId获取spu的销售属性列表
  // GET /admin/product/spuSaleAttrList/{spuId}
  // getSpuSaleAttrList
  getSpuSaleAttrList(spuId:number){ 
    return request.get<any,SpuSaleAttrData[]>(`/admin/product/spuSaleAttrList/${spuId}`)
  }
}