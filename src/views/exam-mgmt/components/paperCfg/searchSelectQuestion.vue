<script setup lang="ts">
  import { defineAsyncComponent, inject, ref, type Ref } from 'vue';
  import { QuestionListItem, listQuestion } from '@/api/question';
  import useTable from '@/hooks/table/useTable';
  import useLoading from '@/hooks/loading';
  import { addPaperQuestion } from '@/api/exam';
  import { Message } from '@arco-design/web-vue';
  import { max } from 'lodash';

  const DisplayLatex = defineAsyncComponent(() => import('@/components/latex/index.vue'));
  const props = defineProps<{
    subjectId: number;
    subject: string;
    examId: number;
  }>();
  const emits = defineEmits<{
    (e: 'onExchange'): void;
  }>();
  const otherSearchParams = { key: '', subjectId: +props.subjectId, type: -1 };
  const { key, tableData, pagination, loading, setLoading, loadList, handlePageChange, handleSizeChange } = useTable<
    QuestionListItem,
    typeof otherSearchParams
  >({
    requestApi: listQuestion,
    otherSearchParams,
  });

  const { loading: submitLoading, setLoading: setSubmitLoading } = useLoading(false);
  const { loading: modalVisible, setLoading: setVisible } = useLoading(false);
  const questionCacheId = ref(0);
  const form = ref({
    score: 5,
    order: 0,
  });
  const openModal = (id: number) => {
    questionCacheId.value = id;
    setVisible(true);
  };

  const hasOrder = inject('hasOrder') as Ref<number[]>;
  const orderList = ref(new Array(max(hasOrder.value)));
  const chooseOrder = (order: number) => {
    if (hasOrder.value.includes(order)) {
      return;
    }
    form.value.order = order;
  };
  const addQuestion = () => {
    if (!form.value.score) {
      Message.warning('请设置题目分值后再提交');
      return;
    }
    if (!form.value.order) {
      Message.warning('请设置题目序号后再提交');
      return;
    }
    setSubmitLoading(true);
    const data = {
      examId: props.examId,
      order: form.value.order,
      problemId: questionCacheId.value,
      score: form.value.score,
    };
    addPaperQuestion(data)
      .then((res) => {
        const { success } = res;
        if (success) {
          Message.success('题目创建成功');
          emits('onExchange');
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };
  const reset = () => {
    form.value.order = 0;
    form.value.score = 5;
    orderList.value = new Array(max(hasOrder.value));
  };

  loadList();
</script>

<template>
  <div>
    <h3>
      <strong>{{ props.subject + '题库' }}</strong>
    </h3>
    <a-input-search
      v-model:model-value="key"
      allow-clear
      :loading="loading"
      :style="{ width: '200px' }"
      placeholder="输入关键词查询试题"
      @search="loadList"
    />
    <a-table
      class="w-6xl h-2xl mt-3"
      :data="tableData"
      stripe
      :loading="loading"
      page-position="br"
      :pagination="pagination"
      sticky-header
      @page-size-change="handleSizeChange"
      @page-change="handlePageChange"
    >
      <template #columns>
        <a-table-column
          title="序号"
          data-index="id"
          :width="80"
        >
        </a-table-column>
        <a-table-column
          title="难度系数"
          data-index="id"
          :width="100"
        >
          <template #cell="{ record }">
            <a-tag
              color="purple"
              class="infoTag"
            >
              <i class="i-tabler:brand-snowflake mr-1"></i>
              {{ record.expectedDifficulty }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column title="题干">
          <template #cell="{ record }">
            <DisplayLatex :latex="record.title" />
          </template>
        </a-table-column>
        <a-table-column
          title="操作"
          :width="100"
        >
          <template #cell="{ record }">
            <a-button
              type="outline"
              @click="openModal(record.id)"
            >
              添加
            </a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <a-modal
      v-model:visible="modalVisible"
      :ok-loading="submitLoading"
      title="配置新增题目信息"
      ok-text="添加试题"
      :mask-closable="false"
      :esc-to-close="false"
      @before-close="reset"
      @ok="addQuestion"
    >
      <a-form :model="form">
        <a-form-item
          field="order"
          label="题目序号"
        >
          <div class="w-7/9">
            <a-tag
              v-for="(_, idx) in orderList"
              :key="idx"
              class="mr-2 mb-3"
              :checkable="!hasOrder.includes(idx + 1)"
              :color="hasOrder.includes(idx + 1) ? 'arcoblue' : form.order === idx + 1 ? '#165dff' : 'gray'"
              @click="chooseOrder(idx + 1)"
            >
              {{ idx + 1 }}
            </a-tag>
            <a-button
              :disabled="orderList.length === hasOrder.length + 1"
              type="text"
              @click="orderList.length++"
            >
              <template #icon>
                <icon-plus />
              </template>
            </a-button>
          </div>
        </a-form-item>
        <a-form-item
          field="score"
          label="分值"
        >
          <a-input-number
            v-model:model-value="form.score"
            mode="button"
          ></a-input-number>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
