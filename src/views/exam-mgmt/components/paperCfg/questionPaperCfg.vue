<script setup lang="ts">
  import { ref, inject, computed, defineAsyncComponent, type Ref } from 'vue';
  import { sum } from 'lodash';
  import { type ExamListItem, getProblemList, uploadExamTemplateApi, deletePaperQuestion } from '@/api/exam';
  import { Question } from '@/api/question';
  import useLoading from '@/hooks/loading';
  import { DescData } from '@arco-design/web-vue/es/descriptions/interface';
  import dayjs from 'dayjs';
  import { RequestOption } from '@arco-design/web-vue/es/upload';
  import { Message } from '@arco-design/web-vue';
  import DisplayLatex from '@/components/latex/index.vue';
  import { getSpecificValueArr } from '@/utils/arrayHelper';
  import getXlsxSheets from '@/utils/common/xlsx';
  import { ExamStateEnum } from '../../config';

  const { examDetail, currentState } = inject('examDetail') as { examDetail: Ref<ExamListItem>; currentState: Ref<ExamStateEnum> };
  const ExchangeQuestionBtn = defineAsyncComponent(() => import('./questionExchange.vue'));
  const emits = defineEmits<{
    (e: 'onChange'): void;
  }>();
  // 试题列表预览
  const problemList = ref<Question[]>([]);
  const problemTotal = ref(examDetail.value.number);
  const exchangeQuestionId = ref(-1);
  const { loading: listLoding, setLoading: setListLoading } = useLoading(false);
  const { loading: uploadLoading, setLoading: setUploadLoading } = useLoading(false);
  const loadQuestionList = () => {
    exchangeQuestionId.value = -1;
    setListLoading(true);
    getProblemList(+examDetail.value.id)
      .then((res) => {
        const { list, total } = res.data;
        problemList.value = list || [];
        problemTotal.value = total;
      })
      .finally(() => {
        setListLoading(false);
      });
  };

  const paperTotalScore = computed(() => {
    const { total = 0 } = examDetail.value;
    let pTScore = 0;
    if (problemList.value.length) {
      const scoreArr = getSpecificValueArr(problemList.value, 'score');
      pTScore = sum(scoreArr);
    } else {
      pTScore = total;
    }
    return pTScore;
  });

  // @ts-ignore
  const descData = computed<DescData[]>(() => {
    const { subject, time, timeLimit } = examDetail.value;
    const start = dayjs
      .unix(time / 1000)
      .format('YYYY-MM-DD HH:mm:ss')
      .slice(0, 16);
    const mins = `${parseInt(`${(timeLimit - time) / (60 * 1000)}`, 10)}分钟`;
    return [
      { label: '科目', value: subject },
      { label: '开考时间', value: start },
      { label: '考试时长', value: mins },
      { label: '试题量', value: problemTotal.value || '暂未上传试题' },
      { label: '试卷满分', value: paperTotalScore.value },
    ];
  });

  // 上传逻辑
  const sheetSelectVisible = ref(false);
  const setSheetSelectVisible = (state: boolean) => {
    sheetSelectVisible.value = state;
  };
  const { loading: sheetLoading, setLoading: setSheetLoading } = useLoading(false);
  const uploadFile = ref<File | null>();
  const xlsxSheets = ref<string[]>();
  const chosenSheet = ref('');
  const handleQuestionUplad = async (opt: RequestOption) => {
    setSheetLoading(true);
    const { fileItem } = opt;
    if (fileItem.file) {
      uploadFile.value = fileItem.file;
      const sheets = await getXlsxSheets(uploadFile.value);
      xlsxSheets.value = sheets;
      setSheetSelectVisible(true);
    }
    setSheetLoading(false);
  };

  const fileUpload = () => {
    if (!chosenSheet.value) {
      Message.warning('请先选择需要导入的sheet');
      return;
    }
    setUploadLoading(true);
    /* eslint-disable */
    uploadFile.value &&
      uploadExamTemplateApi({
        examId: +examDetail.value.id,
        sheet: chosenSheet.value,
        file: uploadFile.value,
      })
        .then(({ success }) => {
          if (success) {
            Message.success(`试题${problemTotal.value === 0 ? '录入' : '追加'}成功`);
            chosenSheet.value = '';
            setSheetSelectVisible(false);
            setUploadLoading(false);
            uploadFile.value = null;
            loadQuestionList();
            emits('onChange');
          }
        })
        .finally(() => {
          setUploadLoading(false);
        });
    /* eslint-disable */
  };

  // 题目更换交互逻辑
  const handleExchangeClose = () => {
    exchangeQuestionId.value = -1;
  };
  const choseExchangeQuestion = (id: number) => {
    exchangeQuestionId.value = exchangeQuestionId.value === id ? -1 : id;
  };
  const handleQuestionExchange = () => {
    handleExchangeClose();
    loadQuestionList();
  };

  const hasOrder = computed<number[]>(() => {
    return getSpecificValueArr(problemList.value, 'order');
  });
  provide('hasOrder', hasOrder);
  // 题目删除逻辑
  const { loading: deleteLoading, setLoading: setDeleteLoading } = useLoading(false);
  const deleteQuestion = (question: Question) => {
    setDeleteLoading(true);
    const data = {
      examId: examDetail.value.id,
      order: question.score,
      score: question.score,
      problemId: question.problemId,
    };
    deletePaperQuestion(data)
      .then((res) => {
        const { success } = res;
        if (success) {
          Message.success('题目删除成功');
          loadQuestionList();
          handleExchangeClose();
        }
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const setupComp = () => {
    loadQuestionList();
  };

  setupComp();
</script>

<template>
  <div class="wh-full">
    <section>
      <a-card title="题卷上传">
        <div class="flex justify-between w-1/1 h-auto">
          <div class="w-2/5">
            <a-descriptions
              :data="descData"
              size="large"
              title="题卷信息"
              :column="1"
            />
          </div>
          <div class="w-3/5 p-4">
            <div
              v-if="currentState === ExamStateEnum.beforeStart"
              class="w-1/1"
            >
              <a-spin
                class="w-1/1"
                tip="xlsx解析中..."
                :loading="sheetLoading"
              >
                <!--@vue-ignore-->
                <a-upload
                  draggable
                  :tip="problemTotal === 0 ? '录入试题, 文件格式为.xlsx' : '追加录入, 文件格式为.xlsx'"
                  accept=".xlsx"
                  :custom-request="handleQuestionUplad"
                />
              </a-spin>
            </div>
            <div v-else>
              <a-result
                status="success"
                title="题卷配置已完成"
              >
                <template #subtitle> 当前周期无法配置试题 </template>
              </a-result>
            </div>
          </div>
        </div>
      </a-card>
    </section>
    <section class="mt-5">
      <a-card title="试题预览">
        <template #extra>
          <div flex="~ items-center">
            <a-button
              type="text"
              @click="loadQuestionList"
            >
              <template #icon>
                <icon-sync :spin="listLoding" />
              </template>
              刷新
            </a-button>
            <ExchangeQuestionBtn
              :exam-id="+examDetail.id"
              :subject-id="+examDetail.subjectId"
              :subject="examDetail.subject"
              @on-success="handleQuestionExchange"
              @on-close="handleExchangeClose"
            />
          </div>
        </template>
        <a-list
          :data="problemList"
          :bordered="false"
          hoverable
          :loading="listLoding"
        >
          <template #item="{ item, index }">
            <a-list-item
              :key="index"
              class="relative"
            >
              <div
                class="flex gap-2 items-start mb-2 transition-transform duration-250"
                :style="{
                  transform: `translateX(${exchangeQuestionId === item.problemId ? -100 : 0}px)`,
                }"
              >
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
              <div
                v-if="currentState === ExamStateEnum.beforeStart"
                class="absolute top-4 right-2 transition-transform duration-250"
                :style="{
                  transform: `translateX(${exchangeQuestionId === item.problemId ? 0 : 100}px)`,
                }"
              >
                <a-button
                  @click="choseExchangeQuestion(item.problemId)"
                  class="mr-5"
                >
                  <template #icon>
                    <icon-settings
                      :strokeWidth="6"
                      size="18"
                      v-show="exchangeQuestionId !== item.problemId"
                    />
                    <icon-right
                      :strokeWidth="6"
                      size="18"
                      v-show="exchangeQuestionId === item.problemId"
                    />
                  </template>
                </a-button>
                <a-popconfirm
                  content="确定移除这道题目吗?"
                  type="error"
                  ok-text="删除"
                  :ok-loading="deleteLoading"
                  @ok="deleteQuestion(item)"
                >
                  <a-button
                    type="primary"
                    status="danger"
                  >
                    <icon-close-circle
                      :strokeWidth="6"
                      size="18"
                      class="mr-1"
                    />
                    删除
                  </a-button>
                </a-popconfirm>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </section>
    <a-modal
      class="sheetModal"
      title="选择导入的sheet"
      v-model:visible="sheetSelectVisible"
      :mask-closable="false"
      :footer="false"
      :esc-to-close="false"
      hide-cancel
    >
      <a-form
        :model="{ chosenSheet }"
        @submit-success="fileUpload"
      >
        <a-form-item
          label="sheet"
          field="groupId"
        >
          <div class="w-7/9 flex justify-start">
            <a-tag
              :checkable="chosenSheet === tag"
              :color="chosenSheet === tag ? '#165dff' : 'gray'"
              v-for="(tag, idx) in xlsxSheets"
              :key="idx"
              class="mr-3 cursor-pointer"
              @click="chosenSheet = tag"
            >
              {{ tag }}
            </a-tag>
          </div>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button
              html-type="submit"
              type="primary"
              :loading="uploadLoading"
              status="success"
              >上传试题</a-button
            >
            <a-button
              @click="
                () => {
                  chosenSheet = '';
                  setSheetLoading(false);
                  setSheetSelectVisible(false);
                }
              "
            >
              取消
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
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
  :deep(.sheetModal .arco-modal-footer) {
    display: none;
  }
</style>
