<template>
  <div
    class="jt-switch"
    :class="{
      [`jt-switch--${size}`]: size,
      'is-disabled': disabled,
      'is-checked': checked,
    }"
    @click="switchValue">
    <input
      class="jt-switch__input"
      type="checkbox"
      role="switch"
      ref="input"
      :name="name"
      :disabled="disabled"
      @keydown.enter="switchValue" />
    <div class="jt-switch__core">
      <div class="jt-switch__core-inner">
        <span
          v-if="activeText || inactiveText"
          class="jt-switch__core-inner-text">
          {{ checked ? activeText : inactiveText }}
        </span>
      </div>
      <div class="jt-switch__core-action"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { SwitchEmits, SwitchProps } from './types';

defineOptions({
  name: 'JtSwitch',
  inheritAttrs: false,
});
const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
});
const emits = defineEmits<SwitchEmits>();

const innerValue = ref(props.modelValue);
const checked = computed(() => innerValue.value === props.activeValue);
const input = ref<HTMLInputElement>();
const switchValue = () => {
  if (props.disabled) return;
  const newValue = checked.value ? props.inactiveValue : props.activeValue;
  innerValue.value = newValue;
  emits('update:modelValue', newValue);
  emits('change', newValue);
};
onMounted(() => {
  input.value!.checked = checked.value;
});
watch(checked, (val) => {
  input.value!.checked = val;
});
watch(
  () => props.modelValue,
  (val) => {
    innerValue.value = val;
  }
);
</script>
