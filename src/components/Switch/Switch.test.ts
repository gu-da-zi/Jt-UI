import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Switch from './Switch.vue';

describe('Switch component', () => {
  it('basic switch', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
      },
    });
    console.log(wrapper.html());

    const switchElement = wrapper.find('.jt-switch');
    expect(switchElement.exists()).toBeTruthy();
    await switchElement.trigger('click');
    expect(wrapper.classes()).toContain('is-checked');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.get('input').element.checked).toBe(true);
  });
  it('keydown enter', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
      },
    });

    const switchElement = wrapper.find('.jt-switch');
    expect(switchElement.exists()).toBeTruthy();
    const inputElement = wrapper.find('[role="switch"]');
    await inputElement.trigger('focus');
    expect(inputElement.element).toBe(document.activeElement);
    expect(wrapper.classes()).toContain('is-checked');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.get('input').element.checked).toBe(true);
  });
});
