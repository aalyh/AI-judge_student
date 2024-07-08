<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { FormType, useForm } from '@/hooks/table/useForm';
  import { type Group } from '@/api/exam';
  import { createGroupApi, updateGroupApi } from '@/api/exam';
  import { ShortcutType, type FormInstance } from '@arco-design/web-vue';
  import { debounce } from '@/utils/common/performance';
  import dayjs from 'dayjs';
  import { CalendarValue } from '@arco-design/web-vue/es/date-picker/interface';
  import { ExamStateEnum, examStateMap } from '../config';

  const props = defineProps<{
    formCfg: {
      visible: boolean;
      formData: Group;
      formType: FormType;
    };
    loadTable: () => Promise<void>;
  }>();
  const emits = defineEmits<{
    (e: 'onClose'): void;
  }>();
  const now = ref(new Date().getTime());
  const formRef = ref<FormInstance>();
  const chosenTimeRange = ref<(number | string | Date)[]>([]);
  const { isFormOpen, formType, form, submitLoading, handleSubmit, openForm, closeForm } = useForm<Group>(formRef, {
    formCreateApi: createGroupApi,
    formUpdateApi: updateGroupApi,
    onSuccess: () => {
      props.loadTable();
    },
    onBeforeClose: () => {
      chosenTimeRange.value = [];
    },
  });
  watch(
    () => props.formCfg,
    debounce(function (newVal) {
      const { visible, formData, formType } = newVal;
      visible ? openForm(formType, formData) : closeForm(); // eslint-disable-line
      if (formType === 'edit') {
        chosenTimeRange.value = [formData.time, formData.timeLimit];
      }
    }),
    { deep: true },
  );
  // @ts-ignore
  const rangeShortcuts: ShortcutType[] = [{ label: '接下来一周', value: () => [dayjs(), dayjs().add(7, 'day')] }];
  const handleSelectTimeRange = (value: CalendarValue[] | undefined) => {
    if (!value) {
      return;
    }
    form.value.time = value[0] as number;
    form.value.timeLimit = value[1] as number;
  };
  const disabledTimeRange = (current: Date) => {
    // 录入假数据, 临时取消限制
    // return dayjs(current).isBefore(dayjs(), 'day');
  };
  const gruopStateOpts = [{ label: '进行中', value: 1 }];
</script>

<template>
  <a-modal
    :visible="isFormOpen"
    :title="`${formType === 'create' ? '创建' : '更新'}考试组`"
    :mask-closable="false"
    :ok-loading="submitLoading"
    :footer="false"
    @cancel="$emit('onClose')"
  >
    <a-form
      ref="formRef"
      :model="form"
      @submit-success="handleSubmit"
    >
      <a-form-item
        field="name"
        label="考试组"
        :rules="[{ required: true, message: '请输入考试组名' }]"
      >
        <a-input
          v-model:model-value="form.name"
          placeholder="请输入考试组名, 如: 第一阶段检测"
        />
      </a-form-item>
      <a-form-item
        field="state"
        label="状态"
        :rules="[{ required: true, message: '请设置考试组状态' }]"
      >
        <!--@vue-ignore-->
        <a-select
          v-model:model-value="form.state"
          :disabled="now > (form.time as number)"
          :options="gruopStateOpts"
          placeholder="设置考试组状态"
        >
          <template #label="{ data }">
            <span>{{ data.label }}</span>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item
        field="time"
        label="考试周期"
        :rules="[{ required: true, message: '请设置考试组周期' }]"
      >
        <!--@vue-ignore-->
        <a-range-picker
          v-model:model-value="chosenTimeRange"
          value-format="timestamp"
          style="width: 300px"
          shortcuts-position="right"
          :shortcuts="rangeShortcuts"
          :disabled-date="disabledTimeRange"
          @change="handleSelectTimeRange"
        />
      </a-form-item>
      <a-form-item
        field="description"
        label="其他信息"
        :rules="[{ required: true, message: '请设置该考试组详细说明信息' }]"
      >
        <a-textarea
          v-model:model-value="form.description"
          placeholder="考试组详细说明信息"
          :max-length="{ length: 300, errorOnly: true }"
          allow-clear
          show-word-limit
          :auto-size="{
            minRows: 3,
            maxRows: 7,
          }"
          :word-slice="(values, maxLength) => values.slice(0, maxLength)"
        />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button
            html-type="submit"
            type="primary"
            :loading="submitLoading"
          >
            {{ formType === 'create' ? '创建' : '更新' }}
          </a-button>
          <a-button @click="emits('onClose')">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
