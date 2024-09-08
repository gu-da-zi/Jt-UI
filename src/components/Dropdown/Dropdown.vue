<template>
  <div class="jt-dropdown">
    <Tooltip
      :trigger="trigger"
      :placement="placement"
      :popper-options="popperOptions"
      :open-delay="openDelay"
      :close-delay="closeDelay"
      @visible-change="visibleChange"
      ref="tooltipRef">
      <slot></slot>
      <template #content>
        <ul class="jt-dropdown__menu">
          <template v-for="item in menuOptions" :key="item.key">
            <li
              v-if="item.divided"
              role="separator"
              class="divided-placeholder"></li>
            <li
              class="jt-dropdown__item"
              @click="($event) => itemClick(item)"
              :class="{
                'is-disbled': item.disabled,
                'is-divided': item.divided,
              }"
              :id="`dropdown-tiem-${item.key}`">
              <RenderVnode :vNode="item.label" />
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>
<script setup lang="ts">
import type {
  DropdownProps,
  DropdownInstance,
  DropdownEmits,
  MenuOption,
} from './types';
import Tooltip from '../Tooltip/Tooltip.vue';
import { ref } from 'vue';
import type { TooltipInstance } from '../Tooltip/types';
import RenderVnode from '../Common/RenderVnode';
const props = withDefaults(defineProps<DropdownProps>(), {
  hideAfterClick: true,
});
const emits = defineEmits<DropdownEmits>();
const tooltipRef = ref<TooltipInstance | null>(null);
const visibleChange = (e: boolean) => {
  emits('visible-change', e);
};
const itemClick = (e: MenuOption) => {
  if (e.disabled) {
    return;
  }
  emits('select', e);
  if (props.hideAfterClick) {
    tooltipRef.value?.hide();
  }
};
defineExpose<DropdownInstance>({
  show: () => tooltipRef.value?.show(),
  hide: () => tooltipRef.value?.hide(),
});
</script>
<style scoped></style>
