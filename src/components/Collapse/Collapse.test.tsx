import { beforeAll, describe, expect, test, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import type { VueWrapper, DOMWrapper } from '@vue/test-utils';
import Collapse from './Collapse.vue';
import CollapseItem from './CollapseItem.vue';
const onChange = vi.fn();
let wrapper: VueWrapper;
let headers: DOMWrapper<Element>[], contents: DOMWrapper<Element>[];
let firstContent: DOMWrapper<Element>,
  secondContent: DOMWrapper<Element>,
  disabledContent: DOMWrapper<Element>,
  firstHeader: DOMWrapper<Element>,
  secondHeader: DOMWrapper<Element>,
  disabledHeader: DOMWrapper<Element>;

describe('Collapse.vue', () => {
  beforeAll(() => {
    wrapper = mount(
      () => (
        <Collapse modelValue={['a']} onChange={onChange}>
          <CollapseItem name="a" title="title a">
            content a
          </CollapseItem>
          <CollapseItem name="b" title="title b">
            content b
          </CollapseItem>
          <CollapseItem name="c" title="title c" disabled>
            content c
          </CollapseItem>
        </Collapse>
      ),
      {
        global: {
          stubs: ['Icon'],
        },
        attachTo: document.body,
      }
    );
    headers = wrapper.findAll('.jt-collapse-item__header');
    contents = wrapper.findAll('.jt-collapse-item__wrapper');
    firstHeader = headers[0];
    secondHeader = headers[1];
    disabledHeader = headers[2];
    firstContent = contents[0];
    secondContent = contents[1];
    disabledContent = contents[2];
  });
  test('测试基础结构以及对应文本', () => {
    // 长度
    expect(headers.length).toBe(3);
    expect(contents.length).toBe(3);
    //文本
    expect(firstHeader.text()).toBe('title a');
    // 内容
    expect(firstContent.isVisible()).toBeTruthy();
    expect(secondContent.isVisible()).toBeFalsy();
    expect(firstContent.text()).toBe('content a');
  });
  test('点击标题展开/关闭内容', async () => {
    // 行为
    await firstHeader.trigger('click');
    expect(firstContent.isVisible()).toBeFalsy();
    await secondHeader.trigger('click');
    expect(secondContent.isVisible()).toBeTruthy();
  });
  test('发送正确的事件', () => {
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith([]);
    expect(onChange).toHaveBeenLastCalledWith(['b']);
  });
  test('disabled 的内容应该没有反应', async () => {
    onChange.mockClear();
    expect(disabledHeader.classes()).toContain('is-disabled');
    await disabledHeader.trigger('click');
    expect(disabledContent.isVisible()).toBeFalsy();
    expect(onChange).not.toHaveBeenCalled();
  });
  test('手风琴模式只展开一个内容项', async () => {
    wrapper = mount(
      () => (
        <Collapse modelValue={['a']} onChange={onChange} accordion>
          <CollapseItem name="a" title="title a">
            content a
          </CollapseItem>
          <CollapseItem name="b" title="title b">
            content b
          </CollapseItem>
          <CollapseItem name="c" title="title c" disabled>
            content c
          </CollapseItem>
        </Collapse>
      ),
      {
        global: {
          stubs: ['Icon'],
        },
        attachTo: document.body,
      }
    );
    headers = wrapper.findAll('.jt-collapse-item__header');
    contents = wrapper.findAll('.jt-collapse-item__wrapper');
    firstHeader = headers[0];
    secondHeader = headers[1];
    disabledHeader = headers[2];
    firstContent = contents[0];
    secondContent = contents[1];
    disabledContent = contents[2];

    // 点击第二个标题
    await secondHeader.trigger('click');
    expect(firstContent.isVisible()).toBeFalsy();
    expect(secondContent.isVisible()).toBeTruthy();

    // 点击第一个标题，应该关闭第二个内容项
    await firstHeader.trigger('click');
    expect(firstContent.isVisible()).toBeTruthy();
    expect(secondContent.isVisible()).toBeFalsy();

    // 点击禁用的第三个标题，不应该有任何变化
    await disabledHeader.trigger('click');
    expect(disabledContent.isVisible()).toBeFalsy();

    // 检查事件是否按预期调用
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(['a']);
  });
});
