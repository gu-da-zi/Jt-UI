<template>
  <div
    class="jt-form-item"
    :class="{
      'is-error': validateStatus.state === 'error',
      'is-success': validateStatus.state === 'success',
      'is-loading': validateStatus.loading,
      'is-required': isRequired,
    }">
    <label for="" class="jt-form-item__label">
      <slot name="label" :label="label">{{ label }}</slot>
    </label>
    <div class="jt-form-item__content">
      <slot :validate="validate"></slot>
      <div
        class="jt-form-item__error-msg"
        v-if="validateStatus.state === 'error'">
        {{ validateStatus.errorMsg }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  inject,
  provide,
  reactive,
  onMounted,
  onUnmounted,
} from 'vue';
import {
  formContextKey,
  formItemContextKey,
  type FormItemContext,
  type FormItemInstance,
  type FormItemProps,
  type FormValidateFailure,
  type ValidateStatusProps,
} from './types';
import { isNil } from 'lodash-es';
import Schema from 'async-validator';

defineOptions({
  name: 'JtFormItem',
});
const props = defineProps<FormItemProps>();

const formContext = inject(formContextKey);
const validateStatus: ValidateStatusProps = reactive({
  state: 'init',
  errorMsg: '',
  loading: false,
});
let initialValue: any = null;

const innerValue = computed(() => {
  const model = formContext?.model;
  if (model && props.prop && !isNil(model[props.prop])) {
    return model[props.prop];
  } else {
    return null;
  }
});
const itemRules = computed(() => {
  const rules = formContext?.rules;
  if (rules && props.prop && rules[props.prop]) {
    return rules[props.prop];
  } else {
    return [];
  }
});

const getTriggerRules = (trigger?: string) => {
  const rules = itemRules.value;
  if (rules) {
    return rules.filter((rule) => {
      if (!rule.trigger || !trigger) {
        return true;
      }
      return rule.trigger && rule.trigger === trigger;
    });
  } else {
    return [];
  }
};

const isRequired = computed(() => {
  return itemRules.value.some((rule) => rule.required);
});

const validate = async (trigger?: string) => {
  const modelName = props.prop;
  const triggeredRules = getTriggerRules(trigger);
  if (!triggeredRules || triggeredRules.length === 0) {
    return true;
  }
  if (modelName) {
    const validator = new Schema({
      [modelName]: triggeredRules,
    });
    validateStatus.loading = true;
    return validator
      .validate({ [modelName]: innerValue.value })
      .then(() => {
        validateStatus.state = 'success';
      })
      .catch((e: FormValidateFailure) => {
        const { errors } = e;
        validateStatus.state = 'error';
        validateStatus.errorMsg =
          errors && errors.length > 0 ? errors[0].message || '' : '';
        console.log('校验失败', e.errors);
        return Promise.reject(e);
      })
      .finally(() => {
        validateStatus.loading = false;
      });
  }
};
const clearValidate = () => {
  validateStatus.state = 'init';
  validateStatus.errorMsg = '';
  validateStatus.loading = false;
};
const resetField = () => {
  clearValidate();
  const model = formContext?.model;
  if (model && props.prop && !isNil(model[props.prop])) {
    model[props.prop] = initialValue;
  }
};
const context: FormItemContext = {
  validate,
  prop: props.prop || '',
  clearValidate,
  resetField,
};

provide(formItemContextKey, context);

onMounted(() => {
  if (props.prop) {
    formContext?.addField(context);
    initialValue = innerValue.value;
  }
});
onUnmounted(() => {
  formContext?.removeField(context);
});
defineExpose<FormItemInstance>({
  validateStatus,
  validate,
  resetField,
  clearValidate,
});
</script>
<style scoped></style>
