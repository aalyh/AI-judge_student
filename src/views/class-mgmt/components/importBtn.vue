<script setup lang="ts">
  /**
   * 此组件是一个按钮，点击后弹出模态窗
   */
  import { ref, reactive, watch } from 'vue';
  import { type FileItem, Message } from '@arco-design/web-vue';
  import { uploadClass } from '@/api/class';
  import getXlsxSheets from '@/utils/common/xlsx';
  import useLoading from '@/hooks/loading';

  const emit = defineEmits<{
    /**
     * 上传成功，那么就需要重新请求列表
     */
    success: [];
  }>();

  // modal
  const title = '批量导入';
  const modalVisible = ref(false);

  const form = reactive<{ sheet: string }>({ sheet: '' });
  const sheetsList = ref<string[]>([]);
  /**
   * 注意我们不使用arco自带的上传，因此只需要获得 File 对象即可
   */
  const file = ref<FileItem | null>();

  const { loading: uploadLoading, setLoading: setUploadLoading } = useLoading(false);
  async function handleUpload(): Promise<boolean> {
    if (!file.value?.file) {
      Message.error('请先选择文件！');
      return false;
    }
    try {
      setUploadLoading(true);
      const sendSheet = form.sheet === '全部' ? '' : form.sheet;
      await uploadClass(file.value.file, sendSheet);
      Message.info('上传成功');
      setUploadLoading(false);
      emit('success');
      return true;
    } catch {
      return false;
    } finally {
      setUploadLoading(false);
    }
  }

  const onDelete = () => {
    file.value = undefined;
  };

  const onChange = async (_: unknown, currentFile: FileItem) => {
    file.value = currentFile;
    sheetsList.value = await getXlsxSheets(currentFile.file as File);
    sheetsList.value.unshift('全部');
  };

  watch(
    () => modalVisible.value,
    (newVal) => {
      if (!newVal) {
        setTimeout(() => {
          file.value = null;
          form.sheet = '';
        }, 400);
      }
    },
  );
</script>

<template>
  <a-button @click="modalVisible = true">{{ title }}</a-button>
  <!-- modal -->

  <a-modal
    v-model:visible="modalVisible"
    ok-text="确认导入"
    :ok-loading="uploadLoading"
    @before-ok="handleUpload"
  >
    <template #title>{{ title }}</template>

    <a-form
      :model="form"
      layout="vertical"
    >
      <a-form-item
        field="sheet"
        label="上传的Sheet"
        tooltip="Excel表格文件的Sheet名称"
        :rules="[{ required: true, message: '请选择需要上传的Sheet' }]"
      >
        <div
          v-if="file"
          class="w-7/9 flex justify-start"
        >
          <a-tag
            v-for="(tag, idx) in sheetsList"
            :key="idx"
            :checkable="form.sheet === tag"
            :color="form.sheet === tag ? '#165dff' : 'gray'"
            class="mr-3 cursor-pointer"
            @click="form.sheet = tag"
          >
            {{ tag }}
          </a-tag>
        </div>
        <div
          v-else
          class="text-1.2em color-gray font-800 text-center w-full"
        >
          文件上传后自动生成
        </div>
      </a-form-item>
      <a-form-item
        field="file"
        label="Excel文件"
        tooltip="此处上传Excel文件（.xlsx）"
      >
        <a-alert
          v-if="file"
          :show-icon="false"
        >
          <div class="flex justify-between items-center gap-4">
            {{ file.name }}
            <a-button
              size="small"
              type="text"
              status="danger"
              @click="onDelete"
              >重新选择</a-button
            >
          </div>
        </a-alert>

        <a-upload
          v-else
          list-type="text"
          accept=".xlsx"
          :file-list="file ? [file] : []"
          :show-file-list="false"
          draggable
          :auto-upload="false"
          :limit="1"
          @change="onChange"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
