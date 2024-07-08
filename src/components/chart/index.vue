<template>
  <VCharts
    v-if="renderChart"
    ref="chartRef"
    :option="options"
    :autoresize="autoResize"
    :style="{ width, height }"
    :onmouseover="handleMouseOver"
    :onmouseout="handleMouseOut"
  />
</template>

<script lang="ts" setup>
  import { ref, nextTick, onBeforeUnmount } from 'vue';
  import VCharts from 'vue-echarts';
  import { ECElementEvent } from 'echarts';
  import useAutoHighlight from '@/hooks/chart/useAutoHighlight';

  const chartRef = ref();
  // import { useAppStore } from '@/store';

  const props = defineProps({
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    autoHighlight: {
      type: Boolean,
      default: false,
    },
    highlightDelay: {
      type: Number,
      default: 3000,
    },
  });
  type ChartEventCB = (params: ECElementEvent) => boolean | undefined | void;
  // const appStore = useAppStore();
  // const theme = computed(() => {
  //   if (appStore.theme === 'dark') return 'dark';
  //   return '';
  // });
  const renderChart = ref(false);
  const mouseoverDeps = ref<ChartEventCB[]>([]);
  const mouseoutDeps = ref<ChartEventCB[]>([]);

  let autoHighlightTimer: NodeJS.Timer | null; // eslint-disable-line
  const loadFunc = () => {
    const { autoHighlight, options, highlightDelay } = props;
    // 挂载高亮逻辑
    if (autoHighlight) {
      const foo = useAutoHighlight(chartRef, options, highlightDelay);
      if (foo) {
        const { timer, highlightMouseoutFn, highlightMouseoverFn } = foo;
        autoHighlightTimer = timer;
        mouseoverDeps.value.push(highlightMouseoverFn);
        mouseoutDeps.value.push(highlightMouseoutFn);
      }
    }
  };
  const handleMouseOver = (params: ECElementEvent) => {
    mouseoverDeps.value.forEach((fn) => {
      fn && fn(params); // eslint-disable-line
    });
  };
  const handleMouseOut = (params: ECElementEvent) => {
    mouseoverDeps.value.forEach((fn) => {
      fn && fn(params); // eslint-disable-line
    });
  };
  const destory = () => {
    if (autoHighlightTimer) {
      clearInterval(autoHighlightTimer);
      autoHighlightTimer = null;
    }
  };
  // wait container expand
  nextTick(() => {
    renderChart.value = true;
    if (renderChart.value) {
      setTimeout(() => {
        loadFunc();
      }, 500);
    }
  });
  onBeforeUnmount(() => {
    destory();
  });
</script>

<style scoped lang="less"></style>
