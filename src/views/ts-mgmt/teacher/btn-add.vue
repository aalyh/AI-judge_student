<script setup lang="ts">
  /**
   * 此组件是一个按钮，点击后弹出全屏模态窗
   */
  import { ref, reactive } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { createTeacher, Teacher, fieldsDescription } from '@/api/teacher';

  const emit = defineEmits<{
    /**
     * 添加成功，那么就需要重新请求列表
     */
    success: [];
  }>();

  const title = '添加教师';
  // form
  const form = reactive<Omit<Teacher, 'id' | 'createdAt'>>({
    name: '',
    phone: '',
    number: '',
    sex: 0,
    state: 1,
  });

  // modal
  const modalVisible = ref(false);

  async function handleClick() {
    try {
      await createTeacher(form);
      Message.success('添加成功');
      emit('success');
      return true;
    } catch {
      return false;
    }
  }
</script>

<template>
  <a-button
    type="primary"
    @click="modalVisible = true"
  >
    {{ title }}
    <template #icon>
      <icon-plus />
    </template>
  </a-button>
  <!-- modal -->

  <a-modal
    v-model:visible="modalVisible"
    :mask-closable="false"
    :esc-to-close="false"
    ok-text="确认添加"
    @before-ok="handleClick"
  >
    <template #title> {{ title }} </template>
    <a-alert class="my-4">输入完成后，请点击右下角确认添加</a-alert>
    <a-form :model="form">
      <a-form-item
        field="name"
        :label="fieldsDescription.name"
        :tooltip="`教师${fieldsDescription.name}`"
      >
        <a-input
          v-model="form.name"
          placeholder="请输入姓名..."
        />
      </a-form-item>
      <a-form-item
        field="phone"
        :label="fieldsDescription.phone"
        :tooltip="`教师${fieldsDescription.phone}`"
      >
        <a-input
          v-model="form.phone"
          placeholder="请输入手机号..."
        />
      </a-form-item>
      <a-form-item
        field="sex"
        :label="fieldsDescription.sex"
        :tooltip="`教师${fieldsDescription.sex}`"
      >
        <a-switch
          :model-value="Boolean(form.sex)"
          @change="(v) => (form.sex = Number(v))"
        >
          <template #checked>女</template>
          <template #unchecked>男</template>
        </a-switch>
      </a-form-item>
      <a-form-item
        field="number"
        :label="fieldsDescription.number"
        :tooltip="`教师${fieldsDescription.number}`"
      >
        <a-input
          v-model="form.number"
          placeholder="请输入教工号..."
      /></a-form-item>
      <a-form-item
        field="state"
        :label="fieldsDescription.state"
        :tooltip="`教师${fieldsDescription.state}`"
      >
        <a-select
          v-model="form.state"
          placeholder="请选择"
        >
          <a-option :value="0">禁用</a-option>
          <a-option :value="1">启用</a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
