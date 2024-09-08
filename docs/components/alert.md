---
title: Alert | Jt-UI
description: Alert 组件的文档
---

# Alert 警告

用于显示重要的提示信息。

## 基础用法

使用 `type`、`closable`、`center` 和 `showIcon` 来定义 Alert 的样式和行为。

<preview path="../demo/Alert/Basic.vue" title="基础用法" description="Alert 组件的基础用法"></preview>

## 不同类型的 Alert

使用 `type` 属性来定义 Alert 的类型。可选值为 `success`、`warning`、`danger` 和 `info`。

<preview path="../demo/Alert/Types.vue" title="不同类型" description="不同类型的Alert"></preview>

## 可关闭的 Alert

通过设置 `closable` 属性为 `true` 来显示关闭按钮。

<preview path="../demo/Alert/Closable.vue" title="可关闭的Alert" description="可关闭的Alert"></preview>

## 居中的 Alert

通过设置 `center` 属性为 `true` 来使 Alert 内容居中。

<preview path="../demo/Alert/Center.vue" title="居中的Alert" description="居中的Alert"></preview>

### Alert Attributes

| Name        | Description        | Type                                                 | Default |
| ----------- | ------------------ | ---------------------------------------------------- | ------- |
| title       | Alert 标题         | `string`                                             | —       |
| type        | Alert 类型         | `enum` - `'success'\| 'warning'\| 'danger'\| 'info'` | info    |
| description | Alert 描述         | `string`                                             | —       |
| closable    | 是否可关闭         | `boolean`                                            | true    |
| center      | 是否居中           | `boolean`                                            | false   |
| closeText   | 自定义关闭按钮文本 | `string`                                             | —       |
| showIcon    | 是否显示图标       | `boolean`                                            | false   |
| effect      | Alert 的效果       | `enum` - `'light'\| 'dark'`                          | light   |

---
