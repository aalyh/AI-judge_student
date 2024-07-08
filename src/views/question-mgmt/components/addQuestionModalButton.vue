<template>
  <!-- 拆分 -->
  <a-button
    type="primary"
    @click="openModal"
  >
    <template #icon>
      <icon-plus />
    </template>
    <template #default> 添加 </template>
  </a-button>
  <a-modal
    v-model:visible="visible"
    :mask-closable="false"
    :esc-to-close="false"
    title="添加题目"
    :footer="false"
  >
    <a-form
      ref="formRef"
      :model="form"
      @submit-success="handleOk"
    >
      <a-form-item
        filed="type"
        label="题型"
        :rules="[{ required: true, message: '请选择题型' }]"
      >
        <a-select v-model:model-value="form.type">
          <a-option
            v-for="(item, index) in Object.values(QuestionTypeConfigMap)"
            :key="index"
            :value="item.value"
          >
            <a-tag :color="item.tagColor">{{ item.label }}</a-tag>
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        field="title"
        label="题干"
        :rules="[{ required: true, message: '请输入题干信息' }]"
      >
        <a-textarea
          v-model="form.title"
          class="max-h-8em"
        />
      </a-form-item>
      <a-form-item
        field="subject"
        label="科目"
        :rules="[{ required: true, message: '请选择科目' }]"
      >
        <a-select
          v-model:model-value="form.subject"
          :options="subjectOptions.slice(1, subjectOptions.length)"
          :field-names="{ label: 'name', value: 'id' }"
        />
      </a-form-item>
      <a-form-item
        field="expectedDifficulty"
        label="难易度"
        :rules="[{ required: true, message: '请设置期望难度' }]"
      >
        <a-input-number
          v-model="form.expectedDifficulty"
          :min="1"
          :max="23"
          :precision="0"
          mode="button"
        ></a-input-number>
      </a-form-item>
      <a-form-item
        field="source"
        label="来源"
        :rules="[{ required: true, message: '请填写题目来源' }]"
      >
        <a-input
          v-model="form.source"
          placeholder="题目链接"
        ></a-input>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button
            html-type="submit"
            type="primary"
            :loading="submitLoading"
            >创建</a-button
          >
          <a-button @click="handleCancel">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { reactive, ref, inject, watch } from 'vue';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import { Question, createQuestion } from '@/api/question';
  import useLoading from '@/hooks/loading';
  import { QuestionTypeConfigMap } from '../config';

  const subjectOptions = inject('subjectOptions') as any;
  const visible = ref(false);
  const formRef = ref<FormInstance>();
  const openModal = () => {
    visible.value = true;
  };

  const form = reactive<Omit<Question, 'problemId' | 'score' | 'order'>>({
    title: '',
    content: '',
    subject: null,
    state: 0,
    expectedDifficulty: 0,
    source: '',
    type: 0,
  });

  const handleCancel = () => {
    visible.value = false;
  };

  const { loading: submitLoading, setLoading: setsubmitLoading } = useLoading(false);
  function addQuestion() {
    setsubmitLoading(true);
    createQuestion(form)
      .then((res: { message: string }) => {
        const { message } = res;
        if (message === 'success') {
          Message.success('添加成功');
          handleCancel();
        }
      })
      .finally(() => {
        setsubmitLoading(false);
      });
  }
  const handleOk = async () => {
    addQuestion();
  };

  watch(
    () => visible.value,
    (newVal) => {
      if (!newVal) {
        formRef.value?.resetFields();
      }
    },
  );
</script>
