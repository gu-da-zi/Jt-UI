<template>
  <transition
    :name="transitionName"
    @afterLeave="destroyComponent"
    @enter="updateHeight">
    <div
      class="jt-message"
      v-show="visible"
      :class="{ [`jt-message--${type}`]: type, 'is-close': showClose }"
      role="alert"
      ref="messageRef"
      :style="cssStyle"
      @mouseenter="clearTimer"
      @mouseleave="startTimer">
      <div class="jt-message__content">
        <slot>
          <RenderVnode :vNode="message" v-if="message" />
        </slot>
      </div>
      <div class="jt-message__close" v-if="showClose">
        <Icon @click.stop="() => (visible = false)" icon="xmark"></Icon>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import RenderVnode from '../Common/RenderVnode';
import Icon from '../Icon/Icon.vue';
import type { MessageProps } from './types';
import { getLastBottomOffset } from './method';
import useEventListener from '../../hooks/useEventListener';

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'info',
  duration: 3000,
  offset: 20,
  transitionName: 'fade-up',
});

const visible = ref(false);
const messageRef = ref<HTMLDivElement>();
const height = ref(0);
const lastOffset = computed(() => getLastBottomOffset(props.id));
const topOffset = computed(() => props.offset + lastOffset.value);
const bottomOffset = computed(() => height.value + topOffset.value);
const cssStyle = computed(() => ({
  top: topOffset.value + 'px',
  zIndex: props.zIndex,
}));
let timer: any = null;
const startTimer = () => {
  if (props.duration === 0) return;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    visible.value = false;
  }, props.duration);
};
const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};
onMounted(async () => {
  visible.value = true;
  startTimer();
});
const keydown = (e: Event) => {
  const event = e as KeyboardEvent;
  if (event.code === 'Escape') {
    visible.value = false;
  }
};
useEventListener(document, 'keydown', keydown);
const destroyComponent = () => {
  props.onDestory();
};
const updateHeight = () => {
  height.value = messageRef.value!.getBoundingClientRect().height;
};
defineExpose({
  bottomOffset,
  visible,
});
</script>
