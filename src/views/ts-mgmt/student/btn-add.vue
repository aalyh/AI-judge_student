<script setup lang="ts">
  /**
   * 此组件是一个按钮，点击后弹出全屏模态窗
   */
  import { ref, reactive } from 'vue';
  import { createStudent, Student, fieldsDescription } from '@/api/student';
  import { Message } from '@arco-design/web-vue';

  const emit = defineEmits<{
    /**
     * 添加成功，那么就需要重新请求列表
     */
    success: [];
  }>();

  const title = '添加学生';
  // form
  const form = reactive<Omit<Student, 'id'>>({
    class: '',
    number: '',
    name: '',
    sex: 0,
    grade: '',
    graduation: 1,
    state: 1,
  });

  // modal
  const modalVisible = ref(false);

  async function handleClick() {
    try {
      await createStudent(form);
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
    <a-form
      :model="form"
      ok-text="确认添加"
    >
      <a-form-item
        field="name"
        :tooltip="`学生${fieldsDescription.name}`"
        :label="fieldsDescription.name"
      >
        <a-input
          v-model="form.name"
          :placeholder="`请输入${fieldsDescription.name}...`"
        />
      </a-form-item>
      <a-form-item
        field="number"
        :tooltip="`学生${fieldsDescription.number}`"
        :label="fieldsDescription.number"
      >
        <a-input
          v-model="form.number"
          :placeholder="`请输入${fieldsDescription.number}...`"
        />
      </a-form-item>
      <a-form-item
        field="sex"
        :tooltip="`学生${fieldsDescription.sex}`"
        :label="fieldsDescription.sex"
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
        field="class"
        :label="fieldsDescription.class"
        :tooltip="`学生${fieldsDescription.class}`"
      >
        <a-input
          v-model="form.class"
          :placeholder="`请输入${fieldsDescription.class}...`"
      /></a-form-item>
      <a-form-item
        field="grade"
        :label="fieldsDescription.grade"
        :tooltip="`学生${fieldsDescription.grade}`"
      >
        <a-input
          v-model="form.grade"
          :placeholder="`请输入${fieldsDescription.grade}...`"
      /></a-form-item>
      <!-- <a-form-item
        field="graduation"
        :tooltip="`学生${fieldsDescription.graduation}`"
        :label="fieldsDescription.graduation"
      >
        <a-input-number
          v-model="form.graduation"
          :placeholder="`请输入${fieldsDescription.graduation}...`"
          mode="button"
        />
      </a-form-item> -->
      <a-form-item
        field="state"
        :tooltip="`学生${fieldsDescription.state}`"
        :label="fieldsDescription.state"
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
