<script setup lang="ts">
  import { computed, ref, defineAsyncComponent } from 'vue';
  import { ExamStateEnum } from '../../config';

  const QuestionPaperCfg = defineAsyncComponent(() => import('./questionPaperCfg.vue'));
  const AnswerPaperCfg = defineAsyncComponent(() => import('./answerPaperCfg.vue'));

  const props = defineProps<{
    type: 'questionPaper' | 'answerPaper';
    currentState: ExamStateEnum;
  }>();
  const emits = defineEmits<{
    (e: 'onSuccess', type: 'questionPaper' | 'answerPaper'): void;
    (e: 'onClose'): void;
  }>();

  const formDesc = computed(() => {
    const { type } = props;
    if (type === 'questionPaper') {
      return {
        title: '试题卷配置',
        uploadTips: '请上传excel',
      };
    }
    return {
      title: '学生答卷配置',
      uploadTips: '请上传学生答题卡的zip压缩包',
    };
  });

  const visible = ref(false);
  const setVisible = (value: boolean) => {
    visible.value = value;
  };
  const updateDetail = () => {
    emits('onClose');
  };
  defineExpose({
    setUploadVisible: setVisible,
  });
</script>

<template>
  <div>
    <a-drawer
      v-model:visible="visible"
      unmount-on-close
      :mask-closable="false"
      :esc-to-close="false"
      width="60%"
      ok-text="关闭"
      hide-cancel
    >
      <template #title>
        {{ formDesc.title }}
      </template>
      <QuestionPaperCfg
        v-if="type === 'questionPaper'"
        @on-change="updateDetail"
      />
      <AnswerPaperCfg
        v-else
        @on-change="updateDetail"
      />
    </a-drawer>
  </div>
</template>
