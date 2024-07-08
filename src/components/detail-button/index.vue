<script setup lang="ts">
  /**
   * 此组件是一个按钮，点击后弹出详情模态窗
   * 
   * 就像 table 一样使用
   * <a-table
          :columns="columns"
          :data="displayData"  
   *
   * 只不过 data 不是数组，而是数组的一项
   * 
   *! 注意： 组件的 columns 属性中，列名为 $ 开头的不会显示，表示该列是虚拟的，在数据 data 中不存在
   *
   * @see https://arco.design/vue/component/descriptions
   */
  import { ref, PropType } from 'vue';
  /**
   * Better way might be as below,
   * however, currently vue-compiler does NOT support this
   */
  //   import type { DescriptionsInstance } from '@arco-design/web-vue';
  //   const props = defineProps<DescriptionsInstance['$props']>();

  import type { TableColumnData, TableData } from '@arco-design/web-vue';

  const props = defineProps<{
    title?: string;
    data: TableData;
    columns: TableColumnData[];
    layout?: PropType<'horizontal' | 'vertical' | 'inline-horizontal' | 'inline-vertical'>;
    align?: PropType<
      | 'left'
      | 'right'
      | 'center'
      | {
          label?: 'left' | 'right' | 'center' | undefined;
          value?: 'left' | 'right' | 'center' | undefined;
        }
    >;
    size?: PropType<'mini' | 'medium' | 'large' | 'small'>;
  }>();

  defineSlots<{
    default: any;
  }>();

  const descriptionsData = props.columns
    .filter(({ dataIndex }) => !dataIndex?.startsWith('$')) // opt out virtual row
    .map(({ title, dataIndex, slotName }) => ({
      label: title || slotName,
      value: String(props.data[dataIndex!]),
    }));
  // modal
  const modalVisible = ref(false);
</script>

<template>
  <a-button
    type="text"
    @click="modalVisible = true"
  >
    <slot>详情</slot>
  </a-button>

  <!-- modal -->

  <a-modal
    v-model:visible="modalVisible"
    :mask-closable="false"
    :esc-to-close="false"
  >
    <template #title> {{ props.title || '详情' }} </template>
    <a-descriptions
      v-bind="props"
      bordered
      layout="inline-vertical"
      :data="descriptionsData"
    />
  </a-modal>
</template>
