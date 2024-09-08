import { mount } from '@vue/test-utils';
import Tooltip from './Tooltip.vue';
import { describe, vi, test, expect, beforeEach } from 'vitest';
vi.mock('@popperjs/core');
const onVisibleChange = vi.fn();

describe('Tooltip.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  test('basic tooltip', async () => {
    const wrapper = mount(
      () => (
        <div>
          <div id="outside"></div>
          <Tooltip
            content="hello tooltip"
            trigger="click"
            onVisible-change={onVisibleChange}>
            <button id="trigger">Trigger</button>
          </Tooltip>
        </div>
      ),
      {
        attachTo: document.body,
      }
    );
    // 静态测试
    const triggerArea = wrapper.find('#trigger');
    expect(triggerArea.exists()).toBeTruthy();
    expect(wrapper.find('.jt-tooltip__popper').exists()).toBeFalsy();

    triggerArea.trigger('click');
    await vi.runAllTimers();
    expect(wrapper.find('.jt-tooltip__popper').exists()).toBeTruthy();
    expect(wrapper.get('.jt-tooltip__popper').text()).toBe('hello tooltip');
    expect(onVisibleChange).toHaveBeenCalledWith(true);

    wrapper.get('#outside').trigger('click');
    await vi.runAllTimers();
    expect(wrapper.find('.jt-tooltip__popper').exists()).toBeFalsy();
    expect(onVisibleChange).toHaveBeenLastCalledWith(false);
  });
});
