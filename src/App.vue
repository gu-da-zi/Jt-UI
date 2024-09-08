<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import Button from './components/Button/Button.vue';
import Alert from './components/Alert/Alert.vue';
import Collapse from './components/Collapse/Collapse.vue';
import Item from './components/Collapse/CollapseItem.vue';
import Icon from './components/Icon/Icon.vue';
import Dropdown from './components/Dropdown/Dropdown.vue';
import type { ButtonInstance } from './components/Button/types';
import type { MenuOption } from './components/Dropdown/types';
import { createMessage } from './components/Message/method';
const buttonRef = ref<ButtonInstance | null>(null);
const openedValue = ref(['a']);
const trigger = ref<any>('click');
const options: MenuOption[] = [
  { key: 1, label: h('b', 'this is bold') },
  { key: 2, label: 'item2', disabled: true },
  { key: 3, label: 'item3', divided: true },
  { key: 4, label: 'item4' },
];
const inlineConsole = (...args: any) => {
  console.log(...args);
};
onMounted(() => {
  createMessage({
    message: 'hello world',
    duration: 0,
    showClose: true,
    type: 'success',
  });
  createMessage({
    message: 'hello world again',
    duration: 0,
    showClose: true,
    type: 'danger',
  });
  createMessage({ message: 'hello world three', duration: 0, showClose: true });
  if (buttonRef.value) {
    console.log('buttonRef', buttonRef.value.ref);
  }
});
</script>

<template>
  <Alert
    type="warning"
    title="this is title"
    description="this is description"
    center
    closeText="close"
    effect="dark"></Alert>
  <header>
    <Dropdown
      placement="bottom"
      :trigger="trigger"
      :menu-options="options"
      @visible-change="(e) => inlineConsole('visibleChange', e)"
      @select="(e) => inlineConsole('select', e)">
      <img
        alt="Vue logo"
        class="logo"
        src="./assets/logo.svg"
        width="125"
        height="125" />
    </Dropdown>
  </header>
  <Icon :icon="['fas', 'arrow-up']" size="2xl" type="danger" color="#ddd" />

  <main>
    <Button
      ref="buttonRef"
      @click="
        createMessage({
          message: 'click message',
          duration: 0,
          showClose: true,
          type: 'warning',
        })
      "
      >Test Button</Button
    >
    <Button plain>Plain Button</Button>
    <Button round>Round Button</Button>
    <Button circle>JT</Button>
    <Button disabled>Disabled Button</Button>
    <br />
    <br />
    <Button type="primary">Primary</Button>
    <Button type="success">Success</Button>
    <Button type="info">Info</Button>
    <Button type="warning">Warning</Button>
    <Button type="danger">Danger</Button>
    <br />
    <br />
    <Button type="primary" plain>Primary</Button>
    <Button type="success" plain>Success</Button>
    <Button type="info" plain>Info</Button>
    <Button type="warning" plain>Warning</Button>
    <Button type="danger" plain>Danger</Button>
    <br /><br />
    <Button size="large">Large</Button>
    <Button size="small">Small</Button>
    <br /><br />
    <Button size="large" loading>Loading</Button>
    <Button size="large" icon="arrow-up">icon</Button>
    <br /><br />

    <Collapse v-model="openedValue" accordion>
      <Item name="a">
        <template #title>
          <h1>Title A</h1>
        </template>
        <h1>headline title</h1>
        <div>this is content a aaa</div>
      </Item>
      <Item name="b" title="Title B">
        <div>this is bbbb test</div>
      </Item>
      <Item name="c" title="Disabled Title" disabled>
        <div>this is cccc test</div>
      </Item>
    </Collapse>
    <br /><br />
  </main>
</template>

<style>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
