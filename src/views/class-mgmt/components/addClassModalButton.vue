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
    title="添加班级"
    :mask-closable="false"
    :esc-to-close="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form :model="form">
      <a-form-item
        field="name"
        label="班级名称"
      >
        <a-input v-model="form.name" />
      </a-form-item>
      <a-form-item
        field="grade"
        label="年级"
      >
        <a-input v-model="form.grade" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { reactive, ref, watch, toRaw } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { createClass } from '@/api/class';

  const visible = ref(false);

  const openModal = () => {
    visible.value = true;
  };

  const form = reactive<{
    name: string;
    grade: string;
    teacherId: number;
  }>({
    name: '',
    grade: '',
    teacherId: 0,
  });

  function addClass() {
    createClass(form).then((res: { message: string }) => {
      const { message } = res;
      if (message === 'success') {
        Message.success('添加成功');
      }
    });
  }

  const handleCancel = () => {
    visible.value = false;
  };
  const handleOk = () => {
    addClass();
  };
</script>
