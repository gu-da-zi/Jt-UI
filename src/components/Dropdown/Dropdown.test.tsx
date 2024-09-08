import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import Dropdown from './Dropdown.vue';
import type { MenuOption } from './types';
import { h } from 'vue';
const options: MenuOption[] = [
  { key: 1, label: h('b', 'this is bold') },
  { key: 2, label: 'item2', disabled: true },
  { key: 3, label: 'item3', divided: true },
  { key: 4, label: 'item4' },
];
vi.mock('@popperjs/core');
const onVisibleChange = vi.fn();
const onSelect = vi.fn();

describe('Dropdown.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  test('basic dropdown', async () => {
    const wrapper = mount(
      () => (
        <Dropdown
          menuOptions={options}
          trigger="click"
          onVisible-change={onVisibleChange}
          onSelect={onSelect}>
          <button id="trigger">Trigger</button>
        </Dropdown>
      ),
      {
        attachTo: document.body,
      }
    );
    const triggerArea = wrapper.find('#trigger');
    expect(triggerArea.exists()).toBeTruthy();
    expect(triggerArea.text()).toBe('Trigger');
    expect(wrapper.find('.jt-dropdown__menu').exists()).toBeFalsy();

    triggerArea.trigger('click');
    await vi.runAllTimers();
    expect(wrapper.find('.jt-dropdown__menu').exists()).toBeTruthy();
    const items = wrapper.findAll('.jt-dropdown__item');
    expect(options.length).toBe(4);
    expect(items[0].text()).toBe('this is bold');

    items[0].trigger('click');
    await vi.runAllTimers();
    expect(wrapper.find('.jt-dropdown__menu').exists()).toBeFalsy();
  });
});
