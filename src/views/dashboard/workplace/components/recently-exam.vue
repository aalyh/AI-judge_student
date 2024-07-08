<template>
  <a-spin
    :loading="loading"
    style="width: 100%"
  >
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title> 近期考试 </template>
      <template #extra>
        <a-link @click="$router.push({ name: 'exam-mgmt' })">查看更多</a-link>
      </template>
      <a-space
        direction="vertical"
        :size="10"
        fill
      >
        <a-radio-group
          v-model:model-value="type"
          type="button"
          @change="typeChange as any"
        >
          <a-radio :value="1"> 语文 </a-radio>
          <a-radio :value="2"> 数学 </a-radio>
          <a-radio :value="3"> 英语 </a-radio>
        </a-radio-group>
        <a-table
          :data="renderList"
          :pagination="false"
          :bordered="false"
          :scroll="{ x: '100%', y: '264px' }"
        >
          <template #columns>
            <a-table-column
              title="开考时间"
              data-index="time"
            >
              <template #cell="{ record }">
                {{ new Date(record.time).toLocaleString().replace(/\//g, '-').slice(0, 15) }}
              </template>
            </a-table-column>
            <a-table-column
              title="考试名称"
              data-index="name"
            >
              <template #cell="{ record }">
                <a-typography-paragraph
                  :ellipsis="{
                    rows: 1,
                  }"
                >
                  {{ record.name }}
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <a-table-column
              title="状态"
              data-index="state"
              :width="120"
            >
              <template #cell="{ record }">
                <a-tag
                  :color="
                    now <= record.timeLimit ? examStateMap[ExamStateEnum.beforeStart].iconColor : examStateMap[+record.state].iconColor
                  "
                >
                  <i
                    class="mr-2"
                    :class="
                      now <= record.timeLimit ? examStateMap[ExamStateEnum.beforeStart].stepIcon : examStateMap[+record.state].stepIcon
                    "
                  ></i>
                  {{ now <= record.timeLimit ? examStateMap[ExamStateEnum.beforeStart].text : examStateMap[+record.state].text }}
                </a-tag>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ExamListItem, getExamListApi } from '@/api/exam';
  import useLoading from '@/hooks/loading';
  import type { TableData } from '@arco-design/web-vue/es/table/interface';
  import dayjs from 'dayjs';
  import { ref } from 'vue';
  import { ExamStateEnum, examStateMap } from '@/views/exam-mgmt/config';

  const type = ref(2);
  const now = ref(new Date().getTime());
  const { loading, setLoading } = useLoading();
  const renderList = ref<TableData[]>();
  const fetchData = async (contentType: number) => {
    try {
      setLoading(true);
      const { data } = await getExamListApi({ page: 1, pageSize: 5, subjectId: contentType, state: ExamStateEnum.aiJudging });
      renderList.value = data.list;
      now.value = new Date().getTime();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const typeChange = (contentType: number) => {
    fetchData(contentType);
  };
  fetchData(2);
  const dateFormat = (timestamp: number) => {
    return dayjs.unix(timestamp).format('YYYY年MM月DD日');
  };
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }
</style>
