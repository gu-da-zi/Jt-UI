<template>
  <button
    ref="_ref"
    class="jt-button"
    :class="{
      [`jt-button--${type}`]: type,
      [`jt-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType">
    <Icon icon="spinner" spin v-if="loading" />
    <Icon :icon="icon" v-if="icon" />
    <span>
      <slot />
    </span>
  </button>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { ButtonProps } from './types';
import Icon from '../Icon/Icon.vue';
defineOptions({
  name: 'JtButton',
});
withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button',
});

const _ref = ref<HTMLButtonElement>();
defineExpose({
  ref: _ref,
});
</script>
<style></style>
