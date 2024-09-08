<template>
  <div
    class="jt-select"
    :class="{ 'is-disabled': disabled }"
    @click="toggleDropdown"
    @mouseenter="states.mouseHover = true"
    @mouseleave="states.mouseHover = false">
    <Tooltip
      placement="bottom-start"
      manual
      ref="tooltipRef"
      :popper-options="popperOptions"
      @click-outside="controlDropdown(false)">
      <Input
        v-model="states.inputValue"
        :disabled="disabled"
        :placeholder="filteredPlaceholder"
        ref="inputRef"
        :readonly="!filterable || !isDropdownShow"
        @input="debounceOnFilter"
        @keydown="handleKeydown">
        <template #suffix>
          <Icon
            icon="circle-xmark"
            class="jt-select__clear"
            v-if="showClearIcon"
            @mousedown.prevent="NOOP"
            @click.stop="onClear" />
          <Icon
            v-else
            icon="angle-down"
            class="header-angle"
            :class="{ 'is-active': isDropdownShow }" />
        </template>
      </Input>
      <template #content>
        <div class="jt-select__loading" v-if="states.loading">
          <Icon icon="spinner" spin />
        </div>
        <div
          class="jt-select__nodata"
          v-else-if="filterable && !filteredOptions.length">
          no matching data
        </div>
        <ul class="jt-select__menu" v-else>
          <template v-for="(item, index) in filteredOptions" :key="index">
            <li
              class="jt-select__menu-item"
              :class="{
                'is-disabled': item.disabled,
                'is-selected': item.value === states.selectedOption?.value,
                'is-highlighted': states.hightlightIndex === index,
              }"
              :id="`select-item-${item.value}`"
              @click.stop="itemSelect(item)">
              <RenderVnode
                :vNode="renderLabel ? renderLabel(item) : item.label" />
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>
<script setup lang="ts">
import type {
  SelectEmits,
  SelectOption,
  SelectProps,
  SelectStates,
} from './types';
import Tooltip from '../Tooltip/Tooltip.vue';
import Input from '../Input/Input.vue';
import Icon from '../Icon/Icon.vue';
import RenderVnode from '../Common/RenderVnode';
import { computed, reactive, ref, watch, type Ref } from 'vue';
import type { TooltipInstance } from '../Tooltip/types';
import type { InputInstance } from '../Input/types';
import { isFunction, debounce } from 'lodash-es';

const findOption = (value: string) => {
  const option = props.options.find((item) => item.value === value);
  return option || null;
};
defineOptions({
  name: 'JtSelect',
});
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
});
const timeout = computed(() => (props.remote ? 300 : 0));
const emits = defineEmits<SelectEmits>();
const initialOption = findOption(props.modelValue);
const tooltipRef = ref() as Ref<TooltipInstance>;
const inputRef = ref() as Ref<InputInstance>;
const states = reactive<SelectStates>({
  inputValue: initialOption ? initialOption.label : '',
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  hightlightIndex: -1,
});
watch(
  () => props.modelValue,
  (newValue) => {
    const newOption = findOption(newValue);
    if (newOption && initialOption) {
      Object.assign(initialOption, newOption.value);
    }
  }
);

const isDropdownShow = ref(false);
const popperOptions: any = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9],
      },
    },
    {
      name: 'sameWidth',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn({ state }: { state: any }) {
        state.styles.popper.width = `${state.rects.reference.width}px`;
      },
    },
  ],
};
const filteredOptions = ref(props.options);
watch(
  () => props.options,
  (newOptions) => {
    filteredOptions.value = newOptions;
  }
);
const generateFilterOptions = async (searchValue: string) => {
  if (!props.filterable) return;
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(searchValue);
  } else if (
    props.remote &&
    props.remoteMethod &&
    isFunction(props.remoteMethod)
  ) {
    states.loading = true;
    try {
      filteredOptions.value = await props.remoteMethod(searchValue);
    } catch (error) {
      console.error(error);
      filteredOptions.value = [];
    } finally {
      states.loading = false;
    }
  } else {
    filteredOptions.value = props.options.filter((option) =>
      option.label.includes(searchValue)
    );
  }
  states.hightlightIndex = -1;
};
const onFilter = () => {
  generateFilterOptions(states.inputValue);
};
const debounceOnFilter = debounce(() => onFilter(), timeout.value);
const filteredPlaceholder = computed(() => {
  return props.filterable && states.selectedOption && isDropdownShow.value
    ? states.selectedOption.label
    : props.placeholder;
});
const controlDropdown = (show: boolean) => {
  if (show) {
    if (props.filterable && states.selectedOption) {
      states.inputValue = '';
    }
    if (props.filterable) {
      generateFilterOptions(states.inputValue);
    }
    tooltipRef.value?.show();
  } else {
    tooltipRef.value?.hide();
    if (props.filterable) {
      states.inputValue = states.selectedOption
        ? states.selectedOption.label
        : '';
    }
    states.hightlightIndex = -1;
  }
  isDropdownShow.value = show;
  emits('visible-change', show);
};
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
      if (!isDropdownShow.value) {
        controlDropdown(true);
      } else {
        if (
          states.hightlightIndex !== -1 &&
          filteredOptions.value[states.hightlightIndex]
        ) {
          itemSelect(filteredOptions.value[states.hightlightIndex]);
        } else {
          controlDropdown(false);
        }
      }
      break;
    case 'Escape':
      if (isDropdownShow.value) {
        controlDropdown(false);
      }
      break;
    case 'ArrowUp':
      e.preventDefault();
      if (filteredOptions.value.length > 0) {
        if (states.hightlightIndex === -1 || states.hightlightIndex === 0) {
          states.hightlightIndex = filteredOptions.value.length - 1;
        } else {
          states.hightlightIndex--;
        }
      }
      break;
    case 'ArrowDown':
      e.preventDefault();
      if (filteredOptions.value.length > 0) {
        if (
          states.hightlightIndex === -1 ||
          states.hightlightIndex === filteredOptions.value.length - 1
        ) {
          states.hightlightIndex = 0;
        } else {
          states.hightlightIndex++;
        }
      }
      break;
    default:
      break;
  }
};
const showClearIcon = computed(() => {
  return (
    props.clearable &&
    states.mouseHover &&
    states.selectedOption &&
    states.inputValue.trim() !== ''
  );
});
const onClear = () => {
  states.selectedOption = null;
  states.inputValue = '';
  emits('clear');
  emits('change', '');
  emits('update:modelValue', '');
};
const NOOP = () => {};
const toggleDropdown = () => {
  if (props.disabled) return;
  if (isDropdownShow.value) {
    controlDropdown(false);
  } else {
    controlDropdown(true);
  }
};
const itemSelect = (e: SelectOption) => {
  if (e.disabled) return;
  states.inputValue = e.label;
  states.selectedOption = e;
  emits('update:modelValue', e.value);
  emits('change', e.value);
  controlDropdown(false);
  inputRef.value.ref.focus();
};
</script>
<style scoped></style>
