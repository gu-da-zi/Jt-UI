<script setup>
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import Button from '@/components/Button/Button.vue';
</script>
<template>
  <div>
    <Tooltip content="hello tooltip" trigger="click">
      <Button> 点击激活 Tooltip </Button>
    </Tooltip>
  </div>
</template>
