<script setup lang="ts">
  import { ref } from 'vue';
  import { type AnswerItem, updateAnswerApi, deleteAnswerApi } from '@/api/answer';
  import useLoading from '@/hooks/loading';
  import { Message, Notification } from '@arco-design/web-vue';
  import DisplayLatex from '@/components/latex/index.vue';

  const props = defineProps<{
    answerItem: AnswerItem;
    index: number;
  }>();
  const emits = defineEmits<{
    (e: 'onSuccess', answer: string, index: number): void;
    (e: 'onRemove', id: number): void;
  }>();
  const answerCache = ref(props.answerItem.answer);
  const isEdit = ref(false);
  const setEdit = (state: boolean) => {
    isEdit.value = state;
  };

  const actionvisible = ref(false);
  const setActionVisible = (state: boolean) => {
    actionvisible.value = state;
  };

  const { loading: submitLoading, setLoading: setSubmitLoading } = useLoading(false);

  const changeEditState = () => {
    answerCache.value = isEdit.value ? '' : props.answerItem.answer;
    setActionVisible(!actionvisible.value);
    if (!actionvisible.value) {
      setEdit(false);
    }
  };
  const submit = () => {
    if (!isEdit.value) {
      isEdit.value = true;
      return;
    }
    if (!answerCache.value) {
      Message.warning('请填写参考答案');
      return;
    }

    setSubmitLoading(true);
    const data = { id: +props.answerItem.id, problemId: props.answerItem.problemId, answer: answerCache.value };
    updateAnswerApi(data)
      .then(({ success }) => {
        if (success) {
          Notification.success('参考答案修改成功');
          const answer = answerCache.value;
          const { index } = props;
          emits('onSuccess', answer, index);
          answerCache.value = '';
          setActionVisible(false);
          setEdit(false);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const quitEdit = () => {
    answerCache.value = '';
    setEdit(false);
  };

  const deleteAnswer = () => {
    setSubmitLoading(true);
    deleteAnswerApi(+props.answerItem.id)
      .then(({ success }) => {
        if (success) {
          Notification.success('参考答案删除成功');
          const { index } = props;
          emits('onRemove', index);
          answerCache.value = '';
          setActionVisible(false);
          setEdit(false);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };
</script>

<template>
  <div class="w-full h-auto mb-20">
    <div class="w-full flex flex-row justify-around">
      <a-tag size="large">{{ props.index + 1 }}</a-tag>
      <div class="w-22/25 h-auto text-1.4em font-600 text-gray-600 line-height-loose break-all">
        <DisplayLatex
          v-if="!isEdit"
          class="px-[12px] py-[4px]"
          :latex="props.answerItem.answer"
        />
        <a-textarea
          v-else
          v-model:model-value="answerCache"
          placeholder="编辑参考答案内容"
          allow-clear
          :auto-size="{ minRows: 5 }"
          class="w-full text-gray-600"
        />
      </div>
      <div class="w-2/25 h-auto relative overflow-hidden">
        <div>
          <a-button
            class="relative left-20 mb-5 iconBtn"
            @click="changeEditState"
          >
            <template #icon>
              <icon-settings
                v-show="!actionvisible"
                :stroke-width="6"
                size="30"
              />
              <icon-up
                v-show="actionvisible"
                :stroke-width="6"
                size="30"
              />
            </template>
          </a-button>
          <div
            v-show="actionvisible"
            class="overflow-hidden"
          >
            <a-button-group
              class="flex flex-col"
              type="primary"
            >
              <a-button
                class="mb-5"
                :status="isEdit ? 'warning' : 'normal'"
                @click="submit"
              >
                {{ isEdit ? '提交修改' : '修改答案' }}
              </a-button>
              <a-button
                v-show="isEdit"
                class="mb-5"
                type="secondary"
                @click="quitEdit"
              >
                取消修改
              </a-button>
              <a-popconfirm
                content="确定要删除该参考答案吗? "
                type="error"
                @ok="deleteAnswer"
              >
                <a-button
                  v-show="!isEdit"
                  class="mb-5"
                  status="danger"
                >
                  删除答案
                </a-button>
              </a-popconfirm>
            </a-button-group>
          </div>
        </div>
      </div>
    </div>
    <span class="w-4/5 h-[2px] bg-gray-200 block ml-20 mt-10"></span>
  </div>
</template>

<style scoped lang="less">
  :deep(.arco-btn-only-icon) {
    padding: 1.3em;
  }
  :deep(.arco-textarea) {
    font-size: 1.4em;
    line-height: 2;
    font-weight: 600;
  }
</style>
