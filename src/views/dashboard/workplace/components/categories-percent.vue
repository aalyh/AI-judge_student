<template>
  <a-spin
    :loading="loading"
    style="width: 100%"
  >
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{
        padding: '20px',
      }"
    >
      <template #title> 考试类别占比 </template>
      <Chart
        height="310px"
        :option="chartOption"
      />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import { SubjectDistriItem, getExamDistri } from '@/api/dashboard';
  import { ref } from 'vue';
  import { getSpecificValueArr } from '@/utils/arrayHelper';
  import { SubjectItem } from '@/api/subject';

  const { loading, setLoading } = useLoading();
  const chartOption = ref({});
  const getOpt = (data: SubjectDistriItem[]) => {
    const label: string[] = getSpecificValueArr(data, 'subjectName');
    const values: number[] = getSpecificValueArr(data, 'count');

    return {
      legend: {
        left: 'center',
        data: label,
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: '40%',
            style: {
              text: '考试场次',
              textAlign: 'center',
              fill: '#4E5969',
              fontSize: 14,
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              // 此处计算总考试场次
              text: Object.values(values).reduce((acc, cur) => acc + cur, 0),
              textAlign: 'center',
              fill: '#1D2129',
              fontSize: 16,
              fontWeight: 500,
            },
          },
        ],
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          label: {
            formatter: '{d}%',
            fontSize: 14,
            color: '#4E5969',
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          data: data.map((item) => {
            return {
              name: item.subjectName,
              value: item.count,
            };
          }),
        },
      ],
    };
  };

  const initData = () => {
    setLoading(true);
    getExamDistri()
      .then(({ success, data }) => {
        if (success) {
          const opt = getOpt(data.list);
          chartOption.value = opt;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  initData();
</script>

<style scoped lang="less"></style>
