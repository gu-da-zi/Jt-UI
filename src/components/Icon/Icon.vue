<template>
  <i
    class="jt-icon"
    :class="{ [`jt-icon--${type}`]: type }"
    :style="customStyles"
    v-bind="$attrs">
    <font-awesome-icon v-bind="filteredProps" />
  </i>
</template>
<script setup lang="ts">
import { computed } from 'vue';
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { ExtendedFontAwesomeIconProps } from './types';
import { omit } from 'lodash-es';
defineOptions({
  name: 'JtIcon',
  inheritAttrs: false,
});
const props = defineProps<ExtendedFontAwesomeIconProps>();
const filteredProps = computed(() => omit(props, ['type', 'color']));
const customStyles = computed(() => {
  return props.color ? { color: props.color } : {};
});
</script>
<style scoped></style>
