<template>
  <form class="jt-form">
    <slot />
  </form>
</template>
<script setup lang="ts">
import { provide } from 'vue';
import {
  formContextKey,
  type FormContext,
  type FormInstance,
  type FormItemContext,
  type FormProps,
  type FormValidateFailure,
} from './types';
import type { ValidateFieldsError } from 'async-validator';

const props = defineProps<FormProps>();
defineOptions({
  name: 'JtForm',
});
const fields: FormItemContext[] = [];
const addField: FormContext['addField'] = (field) => {
  fields.push(field);
};
const removeField: FormContext['removeField'] = (field) => {
  if (field.prop) {
    fields.splice(fields.indexOf(field), 1);
  }
};
const resetFields = (keys: string[] = []) => {
  const filterArr =
    keys.length > 0
      ? fields.filter((item) => keys.includes(item.prop))
      : fields;
  filterArr.forEach((item) => {
    item.resetField();
  });
};
const clearValidate = (keys: string[] = []) => {
  const filterArr =
    keys.length > 0
      ? fields.filter((item) => keys.includes(item.prop))
      : fields;
  filterArr.forEach((item) => {
    item.clearValidate();
  });
};
const validate = async () => {
  let validationErrors: ValidateFieldsError = {};
  for (const field of fields) {
    try {
      await field.validate('');
    } catch (e) {
      const error = e as FormValidateFailure;
      validationErrors = {
        ...validationErrors,
        ...error.fields,
      };
    }
  }
  if (Object.keys(validationErrors).length === 0) {
    return true;
  }
  return Promise.reject(validationErrors);
};
provide(formContextKey, {
  ...props,
  addField,
  removeField,
});

defineExpose<FormInstance>({
  validate,
  resetFields,
  clearValidate,
});
</script>
<style scoped></style>
