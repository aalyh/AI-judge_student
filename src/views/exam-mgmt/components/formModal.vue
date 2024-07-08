<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { createExamApi, getGroupList, updateExamApi } from '@/api/exam';
  import type { ExamFormData } from '@/api/exam';
  import { getSubjectListAPI } from '@/api/subject';
  import { FormInstance, Message, SelectOptionData } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import useLoading from '@/hooks/loading';
  import { ExamStateEnum } from '../config';

  interface Props {
    visible: boolean;
    formData: ExamFormData;
    create: 'create' | 'edit';
  }
  // 组件通信定义
  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    formData: () => {
      return {
        description: '',
        name: '',
        groupId: null,
        state: undefined,
        subject: undefined,
        time: undefined,
        timeLimit: 0,
        type: undefined,
      };
    },
    create: 'create',
  });
  const emits = defineEmits<{
    (e: 'onSucces'): void;
    (e: 'onCancel'): void;
    (e: 'onFail'): void;
  }>();

  // 接收表单
  const initForm: ExamFormData = {
    description: '',
    name: '',
    groupId: null,
    state: undefined,
    subject: undefined,
    time: undefined,
    timeLimit: 0,
    type: undefined,
  };

  const { loading: groupLoading, setLoading: setGroupLoading } = useLoading(false);
  const groupOpts = ref<{ label: string; value: number }[]>([]);
  const initGroupCanUse = async () => {
    setGroupLoading(true);
    getGroupList({ page: 1, pageSize: 100, key: '', order: 1, state: 1 })
      .then((res) => {
        const { list } = res.data;
        groupOpts.value = list.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      })
      .catch((e) => {
        Message.error('可用考试组信息获取失败, 请稍后重试');
      })
      .finally(() => {
        setGroupLoading(false);
      });
  };
  const formInfo = ref<ExamFormData & { examTimeLength?: number }>({ ...props.formData, examTimeLength: 60 });
  const formRef = ref<FormInstance>();
  const okLoading = ref(false);
  watch(
    () => props.visible,
    async (newVal) => {
      if (newVal) {
        await initGroupCanUse();
        if (props.create === 'edit') {
          const timeLength = ((props.formData.timeLimit - (props.formData.time as number)) / 60000).toFixed();
          const groupName = groupOpts.value.find((item) => item.value === formInfo.value.groupId)?.label;
          formInfo.value = { ...props.formData, examTimeLength: +timeLength, groupName };
        } else {
          formInfo.value.examTimeLength = 60;
        }
      } else {
        setTimeout(() => {
          if (formRef.value) {
            formRef.value.resetFields();
            formInfo.value.timeLimit = 0;
            if (Object.prototype.hasOwnProperty.call(formInfo.value, 'id')) {
              delete formInfo.value.id;
            }
          }
        }, 500);
      }
    },
  );

  // select数据
  const subjectList = ref<SelectOptionData[]>([]);
  const initSubjectSelectData = () => {
    getSubjectListAPI({ page: 1, pageSize: 100, key: '' }).then((res) => {
      const { list } = res.data;
      subjectList.value = list.map((item) => {
        return { label: item.name, value: item.id };
      });
    });
  };

  // 时间选择
  const disabledTimeRange = (current: Date) => {
    return dayjs(current).isBefore(dayjs(), 'day');
  };

  // 数据提交
  const submitLoading = ref(false);
  const submit = () => {
    submitLoading.value = true;
    const submitFn = props.create === 'create' ? createExamApi : updateExamApi;
    const start = new Date(formInfo.value.time as number);
    start.setSeconds(0);
    start.setMilliseconds(0);
    formInfo.value.time = start.getTime();
    const end = (formInfo.value.time as number) + (formInfo.value.examTimeLength as number) * 60 * 1000;
    const timeLimit = new Date(end);
    timeLimit.setSeconds(0);
    timeLimit.setMilliseconds(0);
    // 结束时间精确到分钟
    formInfo.value.timeLimit = timeLimit.getTime();
    // formInfo.value.subject = formInfo.value.subjectId;
    const originSubject = formInfo.value.subject;
    if (props.create === 'edit' && Number.isNaN(+(originSubject as unknown as string))) {
      const subjectId = subjectList.value.find((subject) => subject.label === formInfo.value.subject)?.value;
      formInfo.value.subject = +(subjectId as string);
    }
    delete formInfo.value.subjectId;
    delete formInfo.value.examTimeLength;
    submitFn({ ...formInfo.value, state: ExamStateEnum.default })
      .then((res) => {
        const { code, message } = res;
        if (code === 200) {
          Message.success('考试创建成功');
          submitLoading.value = false;
          emits('onSucces');
        } else {
          Message.error(message);
          emits('onFail');
        }
      })
      .finally(() => {
        submitLoading.value = false;
      });
  };

  // 组件初始化、获取数据
  const setupComp = () => {
    initSubjectSelectData();
  };

  setupComp();
</script>

<template>
  <a-modal
    :visible="props.visible"
    :title="`${create === 'create' ? '创建' : '更新'}考试`"
    :mask-closable="false"
    :esc-to-close="false"
    :ok-loading="okLoading"
    :footer="false"
    @cancel="emits('onCancel')"
  >
    <a-form
      ref="formRef"
      :model="formInfo"
      @submit-success="submit"
    >
      <a-form-item
        field="groupId"
        label="考试组"
        :rules="[{ required: true, message: '请配置考试组' }]"
      >
        <!--@vue-ignore-->
        <a-select
          v-model:model-value="formInfo.groupId"
          :loading="groupLoading"
          :options="groupOpts"
          allow-search
          placeholder="输入关键词搜索"
        >
          <template #label="{ data }">
            <span>{{ data.label }}</span>
          </template>
          <template #empty> <span>当前暂无可用考试组</span></template>
        </a-select>
      </a-form-item>
      <a-form-item
        field="name"
        label="考试名"
        :rules="[{ required: true, message: '请输入考试名' }]"
      >
        <a-input
          v-model:model-value="formInfo.name"
          placeholder="请输入考试名"
        />
      </a-form-item>
      <a-form-item
        field="type"
        label="科类"
        :rules="[{ required: true, message: '请选择学科类别' }]"
      >
        <a-select
          v-model:model-value="formInfo.type"
          :options="[
            { value: 0, label: '文' },
            { value: 1, label: '理' },
          ]"
          placeholder="请选择学科类别"
        >
          <template #label="{ data }">
            <span>{{ data.label }}</span>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item
        field="time"
        label="开考时间"
        :rules="[{ required: true, message: '请设置开考时间' }]"
      >
        <!--@vue-ignore-->
        <a-date-picker
          v-model:model-value="formInfo.time"
          show-time
          :show-now-btn="false"
          size="large"
          :day-start-of-week="1"
          :disabled-date="disabledTimeRange"
          value-format="timestamp"
          placeholder="请选择开考时间"
          format="YYYY-MM-DD HH:mm"
        />
      </a-form-item>
      <a-form-item
        name="examTimeLength"
        label="考试时长"
        :rules="[{ required: true, message: '请安排考试时长' }]"
      >
        <a-input-number
          v-model:model-value="formInfo.examTimeLength"
          placeholder="考试时长"
          allow-clear
          hide-button
          model-event="input"
          :max="300"
        >
          <template #append> 分钟 </template>
        </a-input-number>
      </a-form-item>
      <a-form-item
        field="subject"
        label="学科"
        :rules="[{ required: true, message: '请选择学科' }]"
      >
        <a-select
          v-model:model-value="formInfo.subject"
          :options="subjectList"
          placeholder="请选择学科"
        >
          <template #label="{ data }">
            <span>{{ data.label }}</span>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item
        field="description"
        label="其他信息"
      >
        <a-textarea
          v-model:model-value="formInfo.description"
          placeholder="考试其他附注信息"
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
            >{{ create === 'create' ? '创建' : '更新' }}</a-button
          >
          <a-button @click="emits('onCancel')">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
