<template>
  <div>
    <Form :model="model" :rules="rules" ref="formRef">
      <FormItem label="the email" prop="email">
        <Input v-model="model.email" type="text" />
      </FormItem>
      <FormItem label="the password" prop="password">
        <template #label="{ label }">
          <Button>{{ label }}</Button>
        </template>
        <Input type="password" v-model="model.password" />
      </FormItem>
      <FormItem label="confirmPwd" prop="confirmPwd">
        <Input type="password" v-model="model.confirmPwd" />
      </FormItem>
      <div :style="{ textAlign: 'center' }">
        <Button type="primary" @click.prevent="submit">Submit</Button>
        <Button @click.prevent="reset">Reset</Button>
      </div>
    </Form>
  </div>
</template>
<script setup>
import Form from '@/components/Form/Form.vue';
import FormItem from '@/components/Form/FormItem.vue';
import Input from '@/components/Input/Input.vue';
import Button from '@/components/Button/Button.vue';
import { reactive, ref } from 'vue';

const formRef = ref();
const model = reactive({
  email: '123',
  password: '',
  confirmPwd: '',
});
const rules = {
  email: [
    {
      type: 'email',
      required: true,
      trigger: 'blur',
    },
  ],
  password: [
    {
      type: 'string',
      required: true,
      trigger: 'blur',
      min: 3,
      max: 6,
    },
  ],
  confirmPwd: [
    { type: 'string', required: true, trigger: 'blur' },
    {
      validator: (rule, value) => model.password === value,
      message: '两次密码不一致',
      trigger: 'blur',
    },
  ],
};
const submit = async () => {
  try {
    await formRef.value.validate();
    console.log('passed');
  } catch (e) {
    console.log(e);
  }
};
const reset = () => {
  formRef.value.resetFields();
};
</script>
<style scoped></style>
