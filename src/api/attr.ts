import request from '@/utils/request'

interface AttrValueData {
  "id": number,
  "valueName": string,
  "attrId": number
}

export type AttrInfoData = {
  "id": number,
  "attrName": string,
  "categoryId": number,
  "categoryLevel": number,
  "attrValueList": AttrValueData[],
  attrIdValueId?:string
}
export default {
  // /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getList(category1Id: number, category2Id: number, category3Id: number) {
    return request.get<any,AttrInfoData[]>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  }
}