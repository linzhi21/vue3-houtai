<template>
  <div>
    <h2>我爱你赵丽颖</h2>
    <Child></Child>
  </div>
  
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:''
  })
</script>
<script lang="ts" setup>
  import Child from './Child.vue'
</script>

<style scoped>
  div >>> h2{
    color: hotpink;
  }
</style>
