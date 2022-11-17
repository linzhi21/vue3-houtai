<template>
  <div>
    <el-button type="primary" icon="ele-Plus" @click="showAddSpuForm">添加SPU</el-button>

    <!-- table当中data必须是一个数组，数组内部是一个一个对象，我们称之为叫对象的数组 -->
    <el-table :data="spuList"  border stripe style="margin: 20px 0;">
      <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row,$index}">
          <el-button type="success" size="small" :icon="Plus" title="添加Sku" @click="showAddSkuForm(row)"></el-button>
          <el-button type="warning" size="small" icon="ele-Edit" title="修改Spu" @click="showUpdateSpuForm(row)"></el-button>
          <el-button type="info" size="small" icon="ele-InfoFilled" title="查看Spu的Sku列表" @click="showSkuList(row)"></el-button>
          <el-popconfirm :title="`你确定要删除${row.spuName}吗？`" @confirm="deleteSpu(row)">
            <template #reference>
              <el-button type="danger" size="small" icon="ele-Delete" title="删除Spu"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination不要去联想，去官网拿 -->
    <!-- 
       -->
    <el-pagination
      @current-change="getSpuList"
      @size-change="handleSizeChange"
      v-model:current-page="page"
      v-model:page-size="limit"
      :total="total"
      :pager-count="7"
      :page-sizes="[3, 5, 7, 10]"
      layout="prev, pager, next, jumper,->,sizes,total"
    />

    <el-dialog :before-close="beforeClose" v-model="dialogTableVisible" :title="`${spu.spuName}的sku列表`">
      <el-table :data="skuList" v-loading="loading">
        <el-table-column prop="skuName" label="名称"/>
        <el-table-column property="price" label="价格"/>
        <el-table-column property="weight" label="重量"/>
        <el-table-column label="默认图片">
          <template v-slot="{row,$index}">
            <el-image :src="row.skuDefaultImg" style="width:100px;height:80px"></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';


  export default defineComponent({
    name:'SpuList'
  })
</script>
<script lang="ts" setup>
  import {ref,watch} from 'vue'
  import { storeToRefs } from 'pinia';
  import { ElMessage } from 'element-plus';
  import {useCategoryStore} from '@/stores/category'
  import spuApi from '@/api/spu'
  import type {SpuInfoData} from '@/api/spu'
  import {Plus} from '@element-plus/icons-vue'
  import skuApi, { type SkuInfoData } from '@/api/sku'
  //1\ spu的列表数据渲染
  // 以后如果要去计算属性或者监视一个数据，必须先保证数据的响应式
  const page = ref(1)
  const limit = ref(3)
  const categoryStore = useCategoryStore()
  const {category3Id} = storeToRefs(categoryStore)
  const spuList = ref<SpuInfoData[]>([])
  const total = ref(0)
  // 这个函数既当函数我们在调
  // 又当改变页码的事件回调再用
  const getSpuList = async (pager = 1) => {
    page.value = pager
    try {
      const result = await spuApi.getPageList(page.value,limit.value,category3Id.value as number)
      spuList.value = result.records
      total.value = result.total
    } catch (error) {
      ElMessage.error('获取spu分页列表失败')
    }
  }

  const handleSizeChange = (size:number) => {
    limit.value = size
    getSpuList()
  }

  watch(category3Id,(newVal,oldVal) => {
    if(newVal !== ''){
      // 代表要发请求
      getSpuList()
    }else{
      // 代表要清空
      spuList.value = []
    }
  },{immediate:true})


  // 2\点击添加spu和修改spu的按钮切换组件
  const emits = defineEmits(['changeStatus'])

  const showAddSpuForm = () => {
    emits('changeStatus',2)
  }
  const showUpdateSpuForm = (row:SpuInfoData) => {
    emits('changeStatus',2,row)
  }



  // 删除spu的操作
  const deleteSpu = async (row:SpuInfoData) => {
    try {
      await spuApi.deleteSpu(row.id as number)
      ElMessage.success('删除spu成功')
      getSpuList(spuList.value.length > 1?page.value:page.value - 1)
    } catch (error) {
      ElMessage.error('删除spu失败')
    }
  }


  // 点击添加sku的按钮
  const showAddSkuForm = (row:SpuInfoData) => {
    emits('changeStatus',3,row)
  }

  // 点击按钮显示sku列表
  const dialogTableVisible = ref(false)
  const spu = ref<SpuInfoData>({
    spuName: '',
    description: '',
    category3Id: '',
    tmId: '',
    spuSaleAttrList: [],
    spuImageList: []
  })
  const skuList = ref<SkuInfoData[]>([])
  const loading = ref(false)
  const showSkuList = async (row:SpuInfoData) => {
    dialogTableVisible.value = true
    spu.value = row
    loading.value = true
    try {
      const result = await skuApi.findBySpuId(row.id as number)
      skuList.value = result
    } catch (error) {
      ElMessage.error('获取sku列表失败')
    } finally{
      loading.value = false
    }
  }

  // dialog关闭前重置数据
  const beforeClose = () => {
    skuList.value = []
    loading.value = false
    dialogTableVisible.value = false
  }
</script>

<style lang="less" scoped>
</style>
