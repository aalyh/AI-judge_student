<script setup lang="ts">
  import { inject, computed, type Ref } from 'vue';
  import { type ExamListItem, uploadAnswerSheetApi, getAnswerSheetListApi, AnswerSheetItem } from '@/api/exam';
  import { RequestOption } from '@arco-design/web-vue/es/upload';
  import { DescData, Message } from '@arco-design/web-vue';
  import useTable from '@/hooks/table/useTable';
  import useLoading from '@/hooks/loading';
  import { ExamStateEnum } from '../../config';

  const emits = defineEmits<{
    (e: 'onChange'): void;
  }>();
  const { examDetail, currentState } = inject('examDetail') as { examDetail: Ref<ExamListItem>; currentState: Ref<ExamStateEnum> };
  const otherSearchParams = { examId: +examDetail.value.id, key: '' };
  const {
    loading: listLoding,
    loadList,
    pagination,
    tableData,
    handlePageChange,
    handleSizeChange,
  } = useTable<AnswerSheetItem, typeof otherSearchParams>({
    requestApi: getAnswerSheetListApi,
    otherSearchParams,
  });
  const { loading: uploadLoading, setLoading: setUploadLoading } = useLoading(false);

  // @ts-ignore
  const descData = computed<DescData[]>(() => {
    const { subject } = examDetail.value;
    return [
      { label: '科目', value: subject },
      { label: '录入答题卡数量', value: pagination.value.total },
    ];
  });

  // 答卷列表预览

  // 上传逻辑
  const handleAnswerSheetUplad = (opt: RequestOption): void => {
    setUploadLoading(true);
    const { fileItem } = opt;
    /* eslint-disable */
    fileItem.file &&
      uploadAnswerSheetApi({
        examId: +examDetail.value.id,
        file: fileItem.file,
      })
        .then((res) => {
          const { success } = res;
          if (success) {
            Message.success(`试题${pagination.value.total === 0 ? '录入' : '追加'}成功`);
            loadList();
            emits('onChange');
          }
        })
        .finally(() => {
          setUploadLoading(false);
        });
    /* eslint-disable */
  };

  //

  const setupComp = () => {
    loadList();
  };

  setupComp();
</script>

<template>
  <div class="wh-full flex flex-col">
    <a-card title="答卷配置">
      <div class="flex justify-between w-1/1 h-auto">
        <div class="w-2/5">
          <a-descriptions
            :data="descData"
            size="large"
            title="答题卡信息"
            :column="1"
          />
        </div>
        <div class="w-3/5 p-4">
          <div
            v-if="currentState === ExamStateEnum.default"
            class="w-1/1"
          >
            <a-spin
              class="w-1/1"
              tip="答题卡上传中, 请稍后"
              :loading="uploadLoading"
            >
              <!--@vue-ignore-->
              <a-upload
                draggable
                :tip="pagination.total === 0 ? '录入答题卡压缩包, 文件格式为.zip' : '追加录入, 文件格式为.zip'"
                accept=".zip"
                :custom-request="handleAnswerSheetUplad"
              />
            </a-spin>
          </div>
          <div v-else>
            <a-result
              status="success"
              title="答题卡配置已完成"
            >
              <template #subtitle> 当前周期无法录入答题卡 </template>
            </a-result>
          </div>
        </div>
      </div>
    </a-card>
    <a-table
      :data="tableData"
      class="h-4xl"
      :loading="listLoding"
      page-position="br"
      :pagination="pagination"
      sticky-header
      @page-size-change="handleSizeChange"
      @page-change="handlePageChange"
    >
      <template #columns>
        <a-table-column
          title="答题卡标识"
          :width="30"
          data-index="id"
        />
        <a-table-column
          title="答题卡预览"
          :width="30"
        >
          <template #cell="{ record }">
            <a-image
              :src="record.url"
              height="400"
              fit="cover"
              preview
              alt="图片加载失败"
            />
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
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
