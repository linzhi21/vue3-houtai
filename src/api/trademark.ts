import request from '@/utils/request'
export interface TrademarkData {
  id?: number,
  tmName: string,
  logoUrl: string
}
  
export default {
  // /admin/product/baseTrademark/getTrademarkList
  getList(){
    return request.get<any,TrademarkData[]>('/admin/product/baseTrademark/getTrademarkList')
  }
}
