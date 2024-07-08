<script setup lang="ts">
  /**
   * 参考组成
   */
  import { ref, onMounted } from 'vue';
  import { getScoreList } from '@/api/judge';
  import { getJoinExamClassListApi } from '@/api/exam';
  import BaseChart from '@/components/chart/index.vue';

  const { examId } = defineProps<{
    examId: number;
  }>();
  const isLoading = ref(true);
  const chartOpt = ref({});

  onMounted(async () => {
    // @ts-ignore TODO: fix next time
    const students = await getScoreList({ classId: 0, examId, pageSize: 9999 }).then((res) => res.data.list);
    const classes = await getJoinExamClassListApi(examId).then((res) => res.data.list);

    const data = classes.map((clazz) => {
      return { name: clazz.className, value: students.filter((s) => s.classId === clazz.classId).length };
    });

    chartOpt.value = {
      title: {
        text: '考生组成',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c}人 ({d}%)',
      },

      series: [
        {
          name: '班级名称',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    isLoading.value = false;
  });
</script>

<template>
  <a-spin
    :loading="isLoading"
    class="w-full min-h-200px"
  >
    <BaseChart
      v-if="!isLoading"
      auto-resize
      :options="chartOpt"
      width="800px"
      height="600px"
    />
  </a-spin>
</template>
