<template>
  <Transition name="jt-alert-fade">
    <div
      v-if="visible"
      class="jt-alert"
      :class="{
        [`is-${effect}`]: effect,
        [`jt-alert__${type}`]: type,
        'is-center': center,
      }">
      <Icon
        class="jt-icon jt-alert__icon"
        :class="{
          'is-big': description,
        }"
        :icon="customedIcon"
        v-if="showIcon" />
      <div class="jt-alert__content">
        <span
          class="jt-alert__title"
          v-if="title || $slots.title"
          :class="{
            'is-bold': description,
          }">
          <slot name="title"> {{ title }}</slot>
        </span>
        <p class="jt-alert__description" v-if="description || $slots.default">
          <slot>{{ description }}</slot>
        </p>
        <template v-if="closable">
          <div
            class="jt-alert__close-btn"
            :class="{ 'is-customed': closeText }"
            v-if="closeText"
            @click="hideAlert">
            {{ closeText }}
          </div>
          <Icon
            class="jt-alert__close-btn"
            v-else
            icon="xmark"
            @click="hideAlert" />
        </template>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import Icon from '../Icon/Icon.vue';
import { computed, ref } from 'vue';
import type { AlertProps, AlertEmits } from './types';
defineOptions({
  name: 'JtAlert',
});

const props = withDefaults(defineProps<AlertProps>(), {
  type: 'info',
  closable: true,
  center: false,
  showIcon: false,
  effect: 'light',
});
const emits = defineEmits<AlertEmits>();
const customIconMap = new Map([
  ['info', 'fa-circle-info'],
  ['success', 'fa-circle-check'],
  ['warning', 'fa-circle-exclamation'],
  ['danger', 'fa-circle-xmark'],
]);

const customedIcon = computed(() => {
  let icon = customIconMap.get(props.type);
  return `${icon}`;
});
const visible = ref(true);

const hideAlert = () => {
  visible.value = false;
  emits('close');
};

defineExpose({
  hide: () => hideAlert(),
});
</script>

<style scoped></style>
