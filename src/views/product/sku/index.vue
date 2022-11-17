<template>
  <el-card>
    <el-table :data="skuList" border stripe>
      <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片">
        <template v-slot="{ row, $index }">
          <el-image :src="row.skuDefaultImg" style="width:100px;height: 80px;"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template v-slot="{ row, $index }">
          <el-button @click="onSale(row)" v-if="!row.isSale" type="success" size="small" icon="ele-Top" title="上架">
          </el-button>
          <el-button @click="cancelSale(row)" v-else type="info" size="small" icon="ele-Bottom" title="下架"></el-button>
          <el-button @click="updateSku(row)" type="warning" size="small" icon="ele-Edit" title="修改sku"></el-button>
          <el-button @click="showSkuInfo(row)" type="info" size="small" icon="ele-InfoFilled" title="查看sku详情">
          </el-button>
          <el-button @click="deleteSku(row)" type="danger" size="small" icon="ele-Delete" title="删除sku"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  -->
    <el-pagination @current-change="getSkuList" v-model:current-page="page" v-model:page-size="limit" :pager-count="7"
      :total="total" layout="prev, pager, next, jumper" />

    <el-drawer :with-header="false" v-model="drawer" size="50%">
      <el-row :gutter="20">
        <el-col :span="5" :offset="0">名称</el-col>
        <el-col :span="16" :offset="0">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5" :offset="0">描述</el-col>
        <el-col :span="16" :offset="0">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5" :offset="0">价格</el-col>
        <el-col :span="16" :offset="0">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5" :offset="0">平台属性值</el-col>
        <el-col :span="16" :offset="0">
          <el-tag type="danger" v-for="(attrValue, index) in skuInfo.skuAttrValueList" :key="attrValue.id">
            {{ attrValue.valueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5" :offset="0">销售属性值</el-col>
        <el-col :span="16" :offset="0">
          <el-tag type="danger" v-for="(saleAttrValue, index) in skuInfo.skuSaleAttrValueList" :key="saleAttrValue.id">
            {{ saleAttrValue.saleAttrValueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5" :offset="0">商品图片</el-col>
        <el-col :span="16" :offset="0">
          <!-- 轮播图组件只有高度属性可以控制轮播图的高度
          但是没有宽度属性，需要宽度自己写css -->
          <el-carousel trigger="click" height="400px">
            <el-carousel-item v-for="(image, index) in skuInfo.skuImageList" :key="index">
              <img :src="image.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>

    </el-drawer>

  </el-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Sku'
})
</script>
<script lang="ts" setup>
import type { SkuInfoData } from '@/api/sku';
import { onMounted, ref } from 'vue'
import skuApi from '@/api/sku'
import { ElMessage } from 'element-plus';
const page = ref(1)
const limit = ref(10)

const skuList = ref<SkuInfoData[]>([])
const total = ref(0)
const getSkuList = async (pager = 1) => {
  page.value = pager
  try {
    const result = await skuApi.getPageList(page.value, limit.value)
    skuList.value = result.records
    total.value = result.total
  } catch (error) {
    ElMessage.error('获取sku分页列表失败')
  }
}
onMounted(() => {
  getSkuList()
})


// 上架商品
async function onSale(row: SkuInfoData) {
  try {
    await skuApi.onSale(row.id as number)
    ElMessage.success('上架成功')
    getSkuList()
  } catch (error) {
    ElMessage.error('上架失败')
  }
}

// 下架商品
const cancelSale = async (row: SkuInfoData) => {
  try {
    await skuApi.cancelSale(row.id as number)
    ElMessage.success('下架成功')
    getSkuList()
  } catch (error) {
    ElMessage.error('下架失败')
  }
}

// 点击修改sku
const updateSku = (row: SkuInfoData) => {
  ElMessage.info('正在开发中......')
}

// 点击删除sku
const deleteSku = async (row: SkuInfoData) => {
  try {
    await skuApi.deleteSku(row.id as number)
    ElMessage.success('删除sku成功')
    getSkuList(skuList.value.length > 1 ? page.value : page.value - 1)
  } catch (error) {
    ElMessage.success('删除sku失败')
  }
}

// 点击展示sku详情
const drawer = ref(false)
const skuInfo = ref<SkuInfoData>({
  spuId: '',
  price: 0,
  skuName: '',
  skuDesc: '',
  weight: '',
  tmId: '',
  category3Id: '',
  skuDefaultImg: '',
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: []
})
const showSkuInfo = async (row: SkuInfoData) => {
  drawer.value = true
  try {
    const result = await skuApi.getById(row.id as number)
    skuInfo.value = result
  } catch (error) {

  }
}


</script>
<!-- <style lang="scss">
.el-carousel__indicator {
  button {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: red;
  }

  &.is-active {
    button {
      background-color: blue;
    }
  }
}
</style> -->

<style lang="scss" scoped>
// 在scoped的style当中书写样式
// 会发现有部分样式是生效的
// 也有部分的样式是不生效的

// 解决方案有两种
// 1、不要写在scoped的style当中
// 2、还是写带scoped的style当中，只不过要加深度作用选择器

.el-row {
  height: 40px;
  line-height: 40px;

  .el-col-5 {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: bolder;
    text-align: right;
  }

  .el-col-16 {
    // 只能对块级盒子
    white-space: nowrap; //不换行
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.el-carousel {
  width: 400px;
  border: 1px solid hotpink;
  box-sizing: border-box;

  img {
    width: 400px;
    height: 400px;
  }

  :deep(.el-carousel__indicator ){
  // ::v-deep .el-carousel__indicator {
    button {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: red;
    }
  
    &.is-active {
      button {
        background-color: blue;
      }
    }
  }


}
</style>
