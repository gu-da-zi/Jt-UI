<script setup>
import { ref, h } from 'vue';
import Select from '@/components/Select/Select.vue';
const test = ref('');
const options2 = [
  { label: 'hello', value: '1' },
  { label: 'xyz', value: '2' },
  { label: 'testing', value: '3' },
  { label: 'check', value: '4', disabled: true },
];
const customRender = (option) => {
  return h('div', { className: 'custom-render' }, [
    h('b', option.label),
    h('span', option.value),
  ]);
};
</script>
<template>
  <Select
    v-model="test"
    placeholder="可清空选择器，请选择"
    :options="options2"
    :renderLabel="customRender" />
</template>
<style>
.jt-select__menu-item .custom-render {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
