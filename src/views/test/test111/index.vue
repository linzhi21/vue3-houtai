<template>
  <el-button type="primary" icon="ele-Plus" v-has="'btn.Test111.add'">添加</el-button>
  <el-button type="warning" icon="ele-Edit" v-has="'btn.Test111.update'">修改</el-button>
  <el-button type="danger" icon="ele-Delete" v-has="'btn.Test111.remove'">删除</el-button>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:'Test111'
  })
</script>
<script lang="ts" setup>
</script>

<style lang="less" scoped>
</style>
