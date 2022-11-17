<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spuInfoForm.spuName"></el-input>
    </el-form-item>

    <el-form-item label="品牌">
      <el-select v-model="spuInfoForm.tmId" placeholder="请选择">
        <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in trademarkList" :key="tm.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input placeholder="SPU描述" type="textarea" rows="4" v-model="spuInfoForm.description"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
      <el-upload 
        v-model:file-list="spuImageList" 
        :action="`${baseUrl}/admin/product/fileUpload`"
        list-type="picture-card" 
        :on-preview="handlePictureCardPreview" 
        :on-remove="handleRemove"
        :on-success="handleSuccess">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>


    <el-form-item label="销售属性">
      <el-select v-model="saleAttrIdName" :placeholder="unUsedSaleAttrList.length > 0 ? `还有${unUsedSaleAttrList.length}未选择` : '没有啦！！！'">
        <el-option :value="`${un.id}-${un.name}`" :label="un.name" v-for="(un, index) in unUsedSaleAttrList" :key="un.id"></el-option>
      </el-select>
      <el-button type="primary" @click="addSaleAttr" :disabled="!saleAttrIdName">添加销售属性</el-button>
      <el-table :data="spuSaleAttrList" border stripe>
        <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
        <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值名称列表">
          <template v-slot="{ row, $index }">
            <!--  -->
            <el-tag 
              @close="row.spuSaleAttrValueList.splice(index,1)"
              v-for="(saleAttrValue, index) in row.spuSaleAttrValueList" :key="saleAttrValue.id" class="mx-1"
              closable :disable-transitions="false">
              {{ saleAttrValue.saleAttrValueName }}
            </el-tag>
            <!-- v-model="row.saleAttrValueName"
            row身上本来是没有saleAttrValueName这个属性的
            那么如果用户点击按钮切换为input，输入了东西，这个属性会自动添加到row身上
          而如果用户点击按钮切换为input，没有输入东西，那么row身上还是没有这个属性的 -->
            <el-input 
              @keyup.enter="handleInputConfirm(row)" @blur="handleInputConfirm(row)"
              
              v-model="row.saleAttrValueName"
              v-if="row.isEdit" 
              style="width:100px" 
              ref="InputRef" class="ml-1 w-20" size="small" />
            <!--  -->
            <el-button @click="showInput(row)" v-else class="button-new-tag ml-1" size="small">
              添加
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-button 
              @click="spuSaleAttrList.splice($index,1)"
              type="danger" size="small" title="删除" icon="ele-Delete"></el-button>
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
import { useCategoryStore } from '@/stores/category';



export default defineComponent({
  name: 'SpuForm'
})
</script>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, type UploadFile, type UploadFiles, type UploadProps, type UploadUserFile } from 'element-plus'
import { cloneDeep } from 'lodash';
import trademarkApi, { type TrademarkData } from '@/api/trademark'
import spuApi, { type SpuImageData, type SpuSaleAttrData } from '@/api/spu'
import skuApi from '@/api/sku'
import type { SpuInfoData, BaseSaleAttrData } from '@/api/spu';
import { nextTick } from 'vue';

// 点击取消返回到spu列表页
const emits = defineEmits(['changeStatus'])
// 父组件传递的spu，如果是添加传递的是没有id  如果是修改有id
const props = defineProps<{
  spu: SpuInfoData
}>()
// props传递的数据过来是让子组件使用的，而不是让子组件更改的
// 我们后期是需要收集更改数据的，所以我们就深拷贝一份自己去改
const spuInfoForm = ref<SpuInfoData>(cloneDeep(props.spu))



// 挂载完成以后，请求获取初始化的动态数据进行展示
const trademarkList = ref<TrademarkData[]>([])
const baseSaleAttrList = ref<BaseSaleAttrData[]>([])
const spuImageList = ref<SpuImageData[]>([])
const spuSaleAttrList = ref<SpuSaleAttrData[]>([])

// 从所有的销售属性列表当中去过滤，过滤出在spu自己的销售属性列表当中不存在的，组成一个新的数组
const unUsedSaleAttrList = computed(() => {
  return baseSaleAttrList.value.filter(item => {
    return spuSaleAttrList.value.every(item1 => {
      return item1.saleAttrName !== item.name
    })
  })
})

const getInitAddSpuFormData = async () => {
  // http://localhost:3000/app-dev/admin/product/baseTrademark/getTrademarkList
  let promise1 = trademarkApi.getList()
  // 获取所有的销售属性列表
  // http://localhost:3000/app-dev/admin/product/baseSaleAttrList
  let promise2 = spuApi.getBaseSaleAttrList()

  try {
    const result = await Promise.all([promise1, promise2])
    trademarkList.value = result[0]
    baseSaleAttrList.value = result[1]
  } catch (error) {
    ElMessage.error('获取修改spu的初始化数据失败')
  }
}

const getInitUpdateSpuFormData = async () => {
  // 获取所有的品牌列表
  // http://localhost:3000/app-dev/admin/product/baseTrademark/getTrademarkList
  let promise1 = trademarkApi.getList()
  // 获取所有的销售属性列表
  // http://localhost:3000/app-dev/admin/product/baseSaleAttrList
  let promise2 = spuApi.getBaseSaleAttrList()
  // 获取spu的图片列表
  // http://localhost:3000/app-dev/admin/product/spuImageList/6
  let promise3 = skuApi.getSpuImageList(spuInfoForm.value.id as number)
  // 获取spu自己的销售属性列表
  // http://localhost:3000/app-dev/admin/product/spuSaleAttrList/6
  let promise4 = skuApi.getSpuSaleAttrList(spuInfoForm.value.id as number)

  // Promise.all只是一个方法，方法本质是一个函数
  // 一个函数想要清楚，必须懂函数三要素：功能 参数 返回值
  // Promise.all是用来同时处理多个promise对象的，同时本质是并发 不是并行
  // 参数是一个promise对象的数组
  // 返回值：返回的是一个新的promise
  // 返回的新的promise的状态和结果和数组参数有关系
  // 如果数组当中的promise都是成功的，那么返回的新的promise状态就是成功的，成功的结果是
  // 数组当中所有的promise成功的结果组成的数组
  // 如果数组当中有一个promise是失败的，那么返回的新的promise就是失败的，失败的原因就是
  // 数组当中第一个失败的promise失败的原因
  try {
    const result = await Promise.all([promise1, promise2, promise3, promise4])
    trademarkList.value = result[0]
    baseSaleAttrList.value = result[1]
    spuImageList.value = result[2]
    spuImageList.value.forEach(item => {
      item.name = item.imgName
      item.url = item.imgUrl
    })
    spuSaleAttrList.value = result[3]

  } catch (error) {
    ElMessage.error('获取修改spu的初始化数据失败')
  }
}


onMounted(() => {
  if (spuInfoForm.value.id) {
    // 修改，发4个请求
    getInitUpdateSpuFormData()
  } else {
    // 添加,发2个请求
    getInitAddSpuFormData()
  }
})





// 交互之收集数据

// 上传图片
const baseUrl = import.meta.env.VITE_API_URL
// const fileList = ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  // console.log(uploadFile, uploadFiles)
  // 收集图片列表的时候先收集到外面的spuImageList当中，先不收集到位，因为后期还要整理
  spuImageList.value = uploadFiles as any
}

const handleSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  spuImageList.value = uploadFiles as any
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}



// 收集添加销售属性
// 本质其实就是选中一个未选择的销售属性，把未选择的销售属性构造成spu自己的销售属性数据格式
// 形成一个对象，添加给spu自己的销售属性列表

// 最终要添加的地方是spuSaleAttrList
// 最终要添加的对象是
// {
//   id: number; 不需要
//   spuId: number; 不需要
//   baseSaleAttrId: number;
//   saleAttrName: string;
//   spuSaleAttrValueList:[]
// }


// 收集过程
// 1、选中未选择的销售属性的同时，把id和name给收集起来，先放到一个变量当中
// 2、点击添加销售属性的按钮，在回调当中，把收集的数据给构造成需要的格式对象
// 并且添加到指定的位置
const saleAttrIdName = ref('')
const InputRef = ref<HTMLInputElement>()
const addSaleAttr = () => {
  let [baseSaleAttrId,saleAttrName] = saleAttrIdName.value.split('-')
  let obj = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList:[]
  }
  spuSaleAttrList.value.push(obj)
  // 把saleAttrIdName要清空
  saleAttrIdName.value = ''
}


// 收集添加销售属性值
// 本质其实也是把一个对象添加到指定的位置
// row.spuSaleAttrValueList就是我们要添加的指定位置
// 我们需要添加一个销售属性值对象
// {
//   id: number;  不需要
//   spuId: number; 不需要
//   baseSaleAttrId: number;  //代表销售属性值所属销售属性的id
//   saleAttrValueName: string; //代表销售属性值的名称
//   saleAttrName: string; //不需要 销售属性的名字没用，有id就可以添了
//   isChecked: null;//不需要
// }
const showInput = (row:SpuSaleAttrData) => {
  row.isEdit = true
  row.saleAttrValueName = ''
  // 自动获取焦点
  // nextTick是一个函数  
  // 功能：
  // 参数 回调函数
  // 返回值
  nextTick(() => {
    (InputRef.value as HTMLInputElement).focus()
  })
}

const handleInputConfirm = (row:SpuSaleAttrData) => {
  let {baseSaleAttrId,saleAttrValueName} = row
  let obj = {baseSaleAttrId,saleAttrValueName}
  // 不能为空
  if((saleAttrValueName as string).trim() === ''){
    // ElMessage.error('输入的属性值不能为空')
    row.saleAttrValueName = ''
    row.isEdit = false
    return
  }
  // 判断属性值不能重复,不用去除自身
  let isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === saleAttrValueName)
  if(isRepeat){
    ElMessage.error('输入的属性值不能重复')
    row.saleAttrValueName = ''
    row.isEdit = false
    return
  }
  row.spuSaleAttrValueList.push(obj)

  row.saleAttrValueName = ''
  row.isEdit = false
}



// 保存操作
const categoryStore = useCategoryStore()
const save = async () => {
  // 1、获取请求参数
  let spuInfo = spuInfoForm.value
  // 2、整理参数
  // 1>整理category3Id
  spuInfo.category3Id = categoryStore.category3Id
  // 2>整理spu的图片列表
  spuInfo.spuImageList = spuImageList.value.map(item => {
    return {
      imgName:item.name as string,
      imgUrl:item.imgUrl || item.response.data
    }
  })
  // 3>整理销售属性列表
  spuSaleAttrList.value.forEach(item => {
    delete item.isEdit
    delete item.saleAttrValueName
  })
  spuInfo.spuSaleAttrList = spuSaleAttrList.value
  // 3、发请求
  try {
    await spuApi.addOrUpdate(spuInfo)
    // 4、成功干啥
    ElMessage.success('保存spu成功')
    // 返回到列表页
    emits('changeStatus',1)
  } catch (error) {
    // 5、失败干啥
    ElMessage.error('保存spu失败')
  }
}

</script>

<style lang="less" scoped>

</style>
