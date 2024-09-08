<template>
  <div>
    <Alert
      title="成功提示"
      type="success"
      description="这是一条成功提示信息"
      closable
      showIcon />
    <Alert
      title="警告提示"
      type="warning"
      description="这是一条警告提示信息"
      closable
      showIcon />
    <Alert
      title="错误提示"
      type="danger"
      description="这是一条错误提示信息"
      closable
      showIcon />
    <Alert
      title="信息提示"
      type="info"
      description="这是一条信息提示信息"
      closable
      showIcon />
  </div>
</template>

<script setup>
import Alert from '@/components/Alert/Alert.vue';
</script>
