<script setup>
import Button from '@/components/Button/Button.vue';
</script>
<template>
  <div>
    <Button>默认按钮</Button>
    <Button type="primary">主要按钮</Button>
    <Button type="success">成功按钮</Button>
    <Button type="info">信息按钮</Button>
    <Button type="warning">警告按钮</Button>
    <Button type="danger"> 危险按钮 </Button>
  </div>
  <br />
  <div>
    <Button plain>朴素按钮</Button>
    <Button type="primary" plain>主要按钮</Button>
    <Button type="success" plain>成功按钮</Button>
    <Button type="info" plain>信息按钮</Button>
    <Button type="warning" plain>警告按钮</Button>
    <Button type="danger" plain> 危险按钮 </Button>
  </div>
  <br />
  <div>
    <Button round>圆角按钮</Button>
    <Button type="primary" round>主要按钮</Button>
    <Button type="success" round>成功按钮</Button>
    <Button type="info" round>信息按钮</Button>
    <Button type="warning" round>警告按钮</Button>
    <Button type="danger" round> 危险按钮 </Button>
  </div>
</template>
