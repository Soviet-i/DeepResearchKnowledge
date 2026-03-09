<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>这是第一个组件</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<style scoped>
.hello {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin: 20px 0;
}
</style>
