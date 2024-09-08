<template>
  <div
    class="jt-input"
    :class="{
      [`jt-input--${type}`]: type,
      [`jt-input--${size}`]: size,
      'is-disabled': disabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
      'is-focus': isFocus,
    }">
    <template v-if="type !== 'textarea'">
      <div v-if="$slots.prepend" class="jt-input__prepend">
        <slot name="prepend"></slot>
      </div>
      <div class="jt-input__wrapper">
        <span v-if="$slots.prefix" class="jt-input__prefix">
          <slot name="prefix"></slot>
        </span>
        <input
          class="jt-input__inner"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          ref="inputRef"
          v-bind="attrs"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder"
          :autocomplete="autocomplete"
          :autofocus="autofocus"
          :form="form"
          v-model="innerValue"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange" />
        <span
          v-if="$slots.suffix || showClear || showPasswordArea"
          class="jt-input__suffix"
          @click="keepFocus">
          <slot name="suffix"></slot>
          <Icon
            icon="circle-xmark"
            v-if="showClear"
            class="jt-input__clear"
            @click="clear"
            @mousedown.prevent="NOOP" />
          <Icon
            icon="eye"
            v-if="showPasswordArea && passwordVisible"
            class="jt-input__password"
            @click="togglePasswordVisible" />
          <Icon
            icon="eye-slash"
            v-if="showPasswordArea && !passwordVisible"
            class="jt-input__password"
            @click="togglePasswordVisible" />
        </span>
      </div>
      <div v-if="$slots.append" class="jt-input__append">
        <slot name="append"></slot>
      </div>
    </template>
    <template v-else>
      <textarea
        class="jt-textarea__wrapper"
        v-bind="attrs"
        ref="inputRef"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :form="form"
        v-model="innerValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"></textarea>
    </template>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  ref,
  useAttrs,
  watch,
  type Ref,
} from 'vue';
import type { InputEmits, InputProps } from './types';
import Icon from '../Icon/Icon.vue';
import { formItemContextKey } from '../Form/types';

defineOptions({
  name: 'JtInput',
  inheritAttrs: false,
});
const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autocomplete: 'off',
});
const emits = defineEmits<InputEmits>();
const attrs = useAttrs();
const innerValue = ref(props.modelValue);
const isFocus = ref(false);
const passwordVisible = ref(false);
const inputRef = ref() as Ref<HTMLInputElement>;
const formItemContext = inject(formItemContextKey);
const runValidation = (trigger?: string) => {
  formItemContext?.validate(trigger).catch((e) => {
    console.log(e.errors);
  });
};

const showClear = computed(
  () =>
    props.clearable && !!innerValue.value && !props.disabled && isFocus.value
);
const showPasswordArea = computed(
  () => props.showPassword && !props.disabled && !!innerValue.value
);
const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
};
const NOOP = () => {};
const keepFocus = async () => {
  await nextTick();
  inputRef.value?.focus();
};
const handleInput = () => {
  emits('update:modelValue', innerValue.value);
  emits('input', innerValue.value);
  runValidation('input');
};
const handleChange = () => {
  emits('change', innerValue.value);
  runValidation('change');
};
const handleFocus = (event: FocusEvent) => {
  isFocus.value = true;
  emits('focus', event);
};
const handleBlur = (event: FocusEvent) => {
  isFocus.value = false;
  emits('blur', event);
  runValidation('blur');
};
const clear = () => {
  innerValue.value = '';
  emits('update:modelValue', '');
  emits('clear');
  emits('input', '');
  emits('change', '');
};
watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = newValue;
  }
);
defineExpose({
  ref: inputRef,
});
</script>
<style scoped></style>
