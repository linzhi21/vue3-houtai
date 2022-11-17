<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      {{spu.spuName}}
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuInfoForm.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格">
      <el-input placeholder="价格" type="number" v-model="skuInfoForm.price"></el-input>
    </el-form-item>
    <el-form-item label="重量">
      <el-input placeholder="重量" type="number" v-model="skuInfoForm.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input placeholder="规格描述" type="textarea" rows="4" v-model="skuInfoForm.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item :label="attr.attrName" v-for="(attr, index) in attrList" :key="attr.id">
          <el-select v-model="attr.attrIdValueId" placeholder="请选择">
            <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue, index) in attr.attrValueList" :key="attrValue.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr, index) in spuSaleAttrList" :key="saleAttr.id">
          <el-select v-model="saleAttr.saleAttrIdValueId" placeholder="请选择">
            <el-option 
              :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" 
              v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList" 
              :key="saleAttrValue.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table @selection-change="handleSelectionChange" :data="spuImageList" border stripe>
        <el-table-column type="selection" width="55" />
        <el-table-column label="图片">
          <template v-slot="{row,$index}">
            <el-image :src="row.imgUrl" style="width: 100px;height: 80px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row,$index}">
            <el-button @click="changeDefault(row,spuImageList)" v-if="row.isDefault === '0'" type="primary" size="small">设为默认</el-button>
            <el-tag v-else type="success">默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="emits('changeStatus', 1)">取消</el-button>
    </el-form-item>
  </el-form>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: 'SkuForm'
})
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import attrApi from '@/api/attr'
import skuApi, { type SkuImageData, type SkuInfoData, type SkuAttrValueData, type SkuSaleAttrValueData} from '@/api/sku'
import { storeToRefs } from 'pinia';
import type { SpuImageData, SpuInfoData, SpuSaleAttrData } from '@/api/spu';
import { useCategoryStore } from '@/stores/category'
import type {AttrInfoData} from '@/api/attr'
const props = defineProps<{
  spu: SpuInfoData
}>()

const emits = defineEmits(['changeStatus'])



// 获取初始化动态数据进行展示
const { category1Id, category2Id, category3Id } = storeToRefs(useCategoryStore())
const attrList = ref<AttrInfoData[]>([])
const spuSaleAttrList = ref<SpuSaleAttrData[]>([])
const spuImageList = ref<SpuImageData[]>([])
const getInitAddSkuFormData = async () => {
  // 获取选中的这个分类，所有相关的平台属性列表
  // http://localhost:3000/app-dev/admin/product/attrInfoList/2/13/61
  let promise1 = attrApi.getList(
    category1Id.value as number,
    category2Id.value as number,
    category3Id.value as number
  )
  // 获取当前选中的spu的销售列表
  // http://localhost:3000/app-dev/admin/product/spuSaleAttrList/6
  let promise2 = skuApi.getSpuSaleAttrList(props.spu.id as number)
  // 获取当前选中的spu的图片列表
  // http://localhost:3000/app-dev/admin/product/spuImageList/6
  let promise3 = skuApi.getSpuImageList(props.spu.id as number)

  try {
    const result = await Promise.all([promise1,promise2,promise3])
    attrList.value = result[0]
    spuSaleAttrList.value = result[1]
    spuImageList.value = result[2]
    spuImageList.value.forEach(item => item.isDefault = '0')
  } catch (error) {
    ElMessage.error('获取skuForm初始化动态数据失败')    
  }
}
// 挂在完成获取添加sku界面的初始化动态数据
onMounted(() => {
  getInitAddSkuFormData()
})


// 收集数据
// 无论在什么模块，只要是添加或者修改，我们都会面临着收集数据
// 只要是收集数据就必须考虑以下几个问题
// 1、数据收集到哪?    
  // 一般都是自己定义添加时候收集的对象
  // 而修改时候收集的对象是点击某个row，拷贝所给的
// 2、收集数据收集什么?
  // 要看接口文档当中请求的时候需要什么参数
  // 参数当中需要什么数据，我们就往对象里面收集哪些数据
// 3、怎么收集
  // 经验之谈

  const skuInfoForm = ref<SkuInfoData>({
    // 父组件传递的spu当中是有的
    // 最后保存的时候直接整理进去就好
    tmId: '',
    category3Id: '',
    spuId: '',

    // v-model直接可以收集
    price: 0,
    skuName: '',
    skuDesc: '',
    weight: '',

    // 自己写代码收集
    skuDefaultImg: '',



    skuImageList: [],
    skuAttrValueList: [],
    skuSaleAttrValueList: []
    
    // isSale: number,
    // createTime: string,
  })


  // 收集平台属性值列表的过程（和销售属性值列表过程是一样的）
  // 1、就是往skuInfoForm.skuAttrValueList当中添加对象
  // {
  // id: number, 不需要 
  // attrId: number,
  // valueId: number,
  // skuId: number, 不需要
  // attrName: string,不需要，因为我们要的属性值的信息
  // valueName: string 不需要，因为我们要了id是唯一标识
  // }
  // 2、我们要收集的就是用户选中一个平台属性值，就收集这样一个对象
  // 3、当用户选中的时候，我们可以把当前选中的属性值的id和当前选中的属性值所属属性的id，拼接起来，
  // 挂在当前这个属性身上

  
  // 收集sku的图片列表
  const skuImageList = ref<SkuImageData[]>([])
  // SkuImageData形参类型，我们不需要考虑运行后所出现的数据类型
  // 也就是说可以先指定自己想要的类型
  const handleSelectionChange = (val:SkuImageData[]) => {
    // console.log(val);
    skuImageList.value = val
  }

  // 点击设为默认
  const changeDefault = (row:SpuImageData,spuImageList:SpuImageData[]) => {
    spuImageList.forEach(item => item.isDefault = '0')
    row.isDefault = '1'
    // 收集默认图片的路径
    skuInfoForm.value.skuDefaultImg = row.imgUrl
  } 


  // 点击保存操作

  const save = async () => {
    // 1、获取请求参数
    let skuInfo = skuInfoForm.value
    // 2、整理参数
    // 1》父组件传过来的spu当中数据
    skuInfo.tmId = props.spu.tmId
    skuInfo.category3Id = props.spu.category3Id
    skuInfo.spuId = props.spu.id as number
    // 2》整理图片列表
    skuInfo.skuImageList = skuImageList.value.map(item => {
      return {
        imgName: item.imgName,
        imgUrl: item.imgUrl,
        spuImgId: item.id as number,
        isDefault: item.isDefault
      }
    })

    // 3》整理平台属性值列表和销售属性值列表
    // 目前你把东西挂在 attrList 和 spuSaleAttrList当中的某些对象上
    skuInfo.skuAttrValueList = attrList.value.reduce((prev,item) => {
      if(item.attrIdValueId){
        let [attrId,valueId] = item.attrIdValueId.split(':')
        let obj = {attrId,valueId}
        prev.push(obj)
      }
      return prev
    },[] as SkuAttrValueData[])


    skuInfo.skuSaleAttrValueList = spuSaleAttrList.value.reduce((prev,item) => {
      if(item.saleAttrIdValueId){
        let [saleAttrId,saleAttrValueId] = item.saleAttrIdValueId.split(':')
        let obj = {saleAttrId,saleAttrValueId}
        prev.push(obj)
      }
      return prev
    },[] as SkuSaleAttrValueData[])

    // 3、发请求
    try {
      // 4、成功干啥
      await skuApi.saveSkuInfo(skuInfo)
      ElMessage.success('保存sku成功')
      emits('changeStatus',1)
    } catch (error) {
      // 5、失败干啥
      ElMessage.error('保存sku失败')
    }
  }

 
</script>

<style lang="less" scoped>

</style>
