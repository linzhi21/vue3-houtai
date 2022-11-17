<template>
  <div>
    <el-card>
      <CategorySelector :disabled="showStatus!==1"></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <SpuList v-if="showStatus === 1" @changeStatus="changeStatus"></SpuList>
      <SpuForm v-if="showStatus === 2" @changeStatus="changeStatus" :spu="spu"></SpuForm>
      <SkuForm v-if="showStatus === 3" @changeStatus="changeStatus" :spu="spu"></SkuForm>
    </el-card>

  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Spu'
})
</script>
<script lang="ts" setup>
import SpuList from './components/SpuList/index.vue'
import SpuForm from './components/SpuForm/index.vue'
import SkuForm from './components/SkuForm/index.vue'
import type { SpuInfoData } from '@/api/spu';
import { ref } from 'vue'
const showStatus = ref(1)  //1代表列表页  2代表spu添加或修改页面 3代表sku添加页面

// 这里定义的spu是为了收集添加的数据，不能有id，剩余的数据都是初始化的空值
const spu = ref<SpuInfoData>({
  spuName: '',
  description: '',
  category3Id: '',
  tmId: '',
  spuSaleAttrList: [],
  spuImageList: []
})

const changeStatus = (num: number, row: SpuInfoData) => {
  showStatus.value = num
  if (row) {
    // 修改
    spu.value = row
  } else {
    // 添加
    spu.value = {
      spuName: '',
      description: '',
      category3Id: '',
      tmId: '',
      spuSaleAttrList: [],
      spuImageList: []
    }
  }
}

</script>

<style lang="less" scoped>

</style>
