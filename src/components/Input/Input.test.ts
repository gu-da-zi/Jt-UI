import { describe, expect, it } from 'vitest';
import Input from './Input.vue';
import { mount } from '@vue/test-utils';

describe('Input.vue', () => {
  it('基本展示', () => {
    const wrapper = mount(Input, {
      props: {
        type: 'text',
        size: 'small',
        modelValue: '',
      },
      slots: {
        prepend: 'prepend',
        prefix: 'prefix',
      },
    });
    // 针对动态 class，查看 classes 是否正确
    expect(wrapper.classes()).toContain('jt-input--text');
    expect(wrapper.classes()).toContain('jt-input--small');
    expect(wrapper.classes()).toContain('is-prepend');
    expect(wrapper.classes()).toContain('is-prefix');
    // 针对 v-if 是否渲染正确的标签以及内容
    expect(wrapper.find('input').exists()).toBeTruthy();
    expect(wrapper.get('input').attributes('type')).toBe('text');
    // 针对 slots，是否渲染对应的 slots 内容
    expect(wrapper.find('.jt-input__prepend').exists()).toBeTruthy();
    expect(wrapper.get('.jt-input__prepend').text()).toBe('prepend');
    expect(wrapper.find('.jt-input__prefix').exists()).toBeTruthy();
    expect(wrapper.get('.jt-input__prefix').text()).toBe('prefix');
    // textarea
    const textareaWrapper = mount(Input, {
      props: {
        type: 'textarea',
        modelValue: '',
      },
    });
    expect(textareaWrapper.classes()).toContain('jt-input--textarea');
  });
  it('支持 v-model', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'text',
        modelValue: 'test',
        'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
      },
    });
    // 初始值
    const input = wrapper.get('input');
    expect(input.element.value).toBe('test');
    // 更新值
    await input.setValue('update');
    expect(wrapper.props('modelValue')).toBe('update');
    expect(input.element.value).toBe('update');
    // 更新时触发
    expect(wrapper.emitted()).toHaveProperty('input');
    expect(wrapper.emitted()).toHaveProperty('change');
    const inputEvent = wrapper.emitted('input');
    const changeEvent = wrapper.emitted('change');
    expect(inputEvent![0]).toEqual(['update']);
    expect(changeEvent![0]).toEqual(['update']);
    // v-model 的异步更新
    await wrapper.setProps({ modelValue: 'prop update' });
    expect(input.element.value).toBe('prop update');
  });
  it('支持点击清空字符串', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'test',
        clearable: true,
        type: 'text',
      },
      global: {
        stubs: ['Icon'],
      },
    });
    // 不出现对应的 icon
    expect(wrapper.find('.jt-input__clear').exists()).toBeFalsy();
    const input = wrapper.get('input');
    await input.trigger('focus');
    expect(wrapper.emitted()).toHaveProperty('focus');
    // 出现对应的 icon
    expect(wrapper.find('.jt-input__clear').exists()).toBeTruthy();
    // 点击清空字符串
    await wrapper.get('.jt-input__clear').trigger('click');
    expect(input.element.value).toBe('');

    expect(wrapper.emitted()).toHaveProperty('clear');
    expect(wrapper.emitted()).toHaveProperty('input');
    expect(wrapper.emitted()).toHaveProperty('change');
    const inputEvent = wrapper.emitted('input');
    const changeEvent = wrapper.emitted('change');
    expect(inputEvent![0]).toEqual(['']);
    expect(changeEvent![0]).toEqual(['']);

    await input.trigger('blur');
    expect(wrapper.emitted()).toHaveProperty('blur');
  });
  it('支持切换密码显示', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        showPassword: true,
        type: 'password',
      },
      global: {
        stubs: ['Icon'],
      },
    });
    // 不出现对应的 icon,因为当前值为空
    expect(wrapper.find('.jt-input__password').exists()).toBeFalsy();
    const input = wrapper.get('input');
    expect(input.element.type).toBe('password');
    // 出现对应的 icon,并且 icon 为特定的图标
    await input.setValue('123');
    const eyeIcon = wrapper.find('.jt-input__password');
    expect(eyeIcon.exists()).toBeTruthy();
    expect(eyeIcon.attributes('icon')).toBe('eye-slash');
    // 点击切换密码显示
    await eyeIcon.trigger('click');
    expect(input.element.type).toBe('text');
    expect(wrapper.find('.jt-input__password').attributes('icon')).toBe('eye');
  });
});
