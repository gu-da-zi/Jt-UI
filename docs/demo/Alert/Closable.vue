<template>
  <div>
    <Alert
      title="可关闭的提示"
      type="info"
      description="这是一条可关闭的提示信息"
      closable
      showIcon />
  </div>
</template>

<script setup>
import Alert from '@/components/Alert/Alert.vue';
</script>
