<script setup lang="ts">
  import { type ExamListItem, getProblemList } from '@/api/exam';
  import DisplayLatex from '@/components/latex/index.vue';
  import { ref, inject, type Ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Question } from '@/api/question';
  import { ExamStateEnum } from '../../config';

  const { examDetail } = inject('examDetail') as { examDetail: Ref<ExamListItem>; currentState: Ref<ExamStateEnum> };
  const emits = defineEmits<{
    (e: 'onOpenQuestionCfg'): void;
    (e: 'onPaperLoad', data: { hasProblem: boolean; isUpdate: boolean }): void;
  }>();
  const { loading, setLoading } = useLoading(false);
  const problemList = ref<Question[]>([]);
  const problemTotal = ref(examDetail.value.number);
  const loadPaper = () => {
    setLoading(true);
    getProblemList(+examDetail.value.id)
      .then((res) => {
        const { list, total } = res.data;
        problemList.value = list || [];
        problemTotal.value = total;
        emits('onPaperLoad', { isUpdate: true, hasProblem: !!problemList.value.length });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (examDetail.value.id) {
    loadPaper();
  }
</script>

<template>
  <div class="w-full relative">
    <!-- <a-result
      v-if="now < examDetail.time"
      class="abs-center"
      status="warning"
      title="提示"
    >
      <template #subtitle> 当前周期无法查看最终试题卷 </template>
      <template #extra>
        <a-space>
          <a-button
            type="primary"
            @click="emits('onOpenQuestionCfg')"
            >去完成试题卷配置</a-button
          >
        </a-space>
      </template>
    </a-result> -->
    <div class="h-4xl overflow-auto">
      <a-list
        :data="problemList"
        :bordered="false"
        hoverable
        :loading="loading"
      >
        <template #item="{ item, index }">
          <a-list-item
            :key="index"
            class="relative"
          >
            <div class="flex gap-2 items-start mb-2 transition-transform duration-250">
              <small class="bg-gray-200 text-center aspect-1/1 h-1.5rem line-height-1.5rem align-middle rounded-lg select-none mt-1">
                {{ index + 1 }}.
              </small>
              <h3 class="my-1 w-16/17">
                <display-latex :latex="item.title" />
              </h3>
            </div>
            <div class="flex items-center justify-start pl-1.7em">
              <a-tag
                :color="item.score < 10 ? 'orangered' : '#0fc6c2'"
                class="infoTag"
              >
                <i class="i-tabler-discount-check-filled mr-1"></i>
                满分: {{ item.score }}分
              </a-tag>
              <a-tag
                color="arcoblue"
                class="infoTag"
              >
                <i class="i-tabler:world-search mr-1"></i>
                来源: {{ item.source }}
              </a-tag>
              <a-tag
                color="purple"
                class="infoTag"
              >
                <i class="i-tabler:brand-snowflake mr-1"></i>
                难度系数: {{ item.expectedDifficulty }}
              </a-tag>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<style scoped lang="less">
  .abs-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, 50%);
  }
  .infoTag {
    display: flex;
    align-items: center;
    width: min-content;
    margin-top: 0.25rem;
    font-size: 1.1em;
    font-weight: bold;
    border-radius: 0.4rem;
    margin-right: 6px;
  }
</style>
