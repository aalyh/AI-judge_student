<script setup lang="ts">
  import { getWordCloudApi } from '@/api/data';
  import useLoading from '@/hooks/loading';
  import * as echarts from 'echarts';
  import 'echarts-wordcloud';
  import { ref, watch, inject, onMounted, onUnmounted, type Ref } from 'vue';
  import { ExamListItem } from '@/api/exam';
  import { EChartsType } from 'echarts';
  import { Message } from '@arco-design/web-vue';
  import { ExamStateEnum } from '../../config';
  import { wordCloudBase64Img } from './base64';

  const props = defineProps<{
    paperLoadState: { hasProblem: boolean; isUpdate: boolean };
  }>();
  const emits = defineEmits<{
    (e: 'onRedraw'): void;
  }>();
  const { examDetail, currentState } = inject('examDetail') as { examDetail: Ref<ExamListItem>; currentState: Ref<ExamStateEnum> };
  const { loading: chartLoading, setLoading: setChartLoading } = useLoading(false);
  const opts = ref({} as any);
  const wordCloudChart = ref<null | EChartsType>(null);
  const wordCloud = ref();

  const getWordCloudOpts = (data: any) => {
    // const maskImage = new Image();
    // maskImage.crossOrigin = '';
    // maskImage.src = wordCloudBase64Img;

    const option = {
      series: [
        {
          type: 'wordCloud',
          gridSize: 15,
          sizeRange: [25, 100],
          rotationRange: [0, 30],
          layoutAnimation: true,
          emphasis: {
            focus: 'self',
            textStyle: {
              textShadowBlur: 5,
              textShadowColor: '#333',
            },
          },
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color() {
              return `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
            },
          },
          width: '100%',
          height: '95%',
          // maskImage, base64加进去会渲染不出来, 没看懂, cv的vue2那个项目里的base64，那个里面就没问题
          data,
        },
        0,
      ],
    };
    return option;
  };

  const drawChart = (data: any) => {
    const chart = echarts.getInstanceByDom(wordCloud.value as HTMLDivElement);
    if (!chart || !wordCloudChart.value) {
      wordCloudChart.value = echarts.init(wordCloud.value as HTMLDivElement);
    }
    opts.value = getWordCloudOpts(data);
    wordCloudChart.value.setOption(opts.value);
  };

  const init = () => {
    setChartLoading(false);
    const useCache = currentState.value > ExamStateEnum.beforeStart;
    getWordCloudApi(+examDetail.value.id, 1, useCache) // 目前只有 23 有词云数据
      .then((res) => {
        const list = res.data.list ?? [];
        const data = list.map((item) => {
          return {
            name: item.word,
            value: item.count,
          };
        });
        if (list.length) {
          drawChart(data);
          window.addEventListener('resize', () => {
            wordCloudChart.value?.resize();
          });
        } else {
          Message.warning('试题获取失败, 无法生成试题词云');
        }
      })
      .finally(() => {
        setChartLoading(false);
      });
  };

  watch(
    () => props.paperLoadState.isUpdate,
    (newVal) => {
      if (newVal && currentState.value < ExamStateEnum.default) {
        init();
        emits('onRedraw');
      }
    },
  );
  onMounted(() => {
    init();
  });
  onUnmounted(() => {
    wordCloudChart.value && wordCloudChart.value.dispose(); // eslint-disable-line
    wordCloudChart.value = null;
  });
</script>

<template>
  <div>
    <a-result
      v-if="currentState === ExamStateEnum.beforeStart && !props.paperLoadState.hasProblem"
      class="abs-center"
      status="warning"
      title="提示"
    >
      <template #subtitle> 配置试题卷后, 可查看本场考试知识点词云 </template>
    </a-result>
    <div
      v-else
      class="w-1/1 h-2xl"
    >
      <a-spin
        class="wh-full"
        :loading="chartLoading"
        tip="词云加载中"
      >
        <h1 class="text-center">知识点词云</h1>
        <div
          ref="wordCloud"
          class="wh-full"
        />
      </a-spin>
    </div>
  </div>
</template>
