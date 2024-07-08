<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { SubjectItem, createSubjectAPI, deleteSubjectAPI, getSubjectListAPI, updateSubjectAPI } from '@/api/subject';
  import { Message, type FormInstance } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import useTable from '@/hooks/table/useTable';

  const otherSearchParams = { key: '' };
  const { tableData, pagination, loading, loadList, handlePageChange, handleSizeChange, key } = useTable<
    SubjectItem,
    typeof otherSearchParams
  >({
    requestApi: getSubjectListAPI,
    otherSearchParams,
  });

  const router = useRouter();

  const isFormOpen = ref(false);
  const formRef = ref<FormInstance>();
  const okLoading = ref(false);
  const formType = ref<'create' | 'edit'>('create');
  const form = ref<SubjectItem>({
    name: '',
    type: 0,
    state: 0,
    description: '',
    icon: '',
  });
  function handleSubmit() {
    okLoading.value = true;
    const submitFn = formType.value === 'create' ? createSubjectAPI : updateSubjectAPI;
    submitFn(form.value)
      .then((res) => {
        const { code } = res;
        if (code === 200) {
          Message.success('学科创建成功');
          loadList();
        }
      })
      .finally(() => {
        okLoading.value = false;
        isFormOpen.value = false;
      });
  }
  async function openForm(type: 'create' | 'edit', data?: SubjectItem) {
    formType.value = type;
    isFormOpen.value = true;
    if (type === 'edit') {
      Object.keys(data as SubjectItem).forEach((key) => {
        form.value[key] = data![key];
      });
    }
    formType.value = type;
    isFormOpen.value = true;
  }

  function deleteSubject(data: SubjectItem) {
    const { id } = data;
    deleteSubjectAPI(id as number).then((res) => {
      const { code } = res;
      if (code === 200) {
        Message.success('删除成功');
        loadList();
      }
    });
  }
  watch(
    () => isFormOpen.value,
    (newVal) => {
      if (!newVal) {
        setTimeout(() => {
          if (formRef.value) {
            formRef.value.resetFields();
            if (Object.prototype.hasOwnProperty.call(form.value, 'id')) {
              delete form.value.id;
            }
          }
        }, 500);
      }
    },
  );

  function jumpDetail(query: SubjectItem) {
    router.push({
      path: '/subject-mgmt/answerSheet',
      query,
    });
  }

  loadList();
</script>

<template>
  <div>
    <a-layout h="5xl">
      <a-layout-header>
        <a-card>
          <header class="pt-4 pb-8">
            <strong class="text-2xl"> 学科管理 </strong>
          </header>
          <section
            w="full"
            p="x-4"
            flex="~ justify-between items-center"
          >
            <div w="1/4">
              <a-input-search
                v-model="key"
                allow-clear
                placeholder="输入关键字查找学科"
                search-button
                @search="loadList"
              />
            </div>
            <div
              v-if="false"
              w="1/4"
            >
              <a-button
                type="primary"
                @click="openForm('create')"
              >
                <template #icon>
                  <icon-plus-circle />
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>创建学科</template>
              </a-button>
            </div>
          </section>
        </a-card>
      </a-layout-header>
      <a-layout-content>
        <a-card h="full">
          <a-table
            h="4xl"
            :data="tableData"
            stripe
            :loading="loading"
            page-position="br"
            :pagination="pagination"
            sticky-header
            @page-size-change="handleSizeChange"
            @page-change="handlePageChange"
          >
            <template #columns>
              <a-table-column
                title="学科"
                data-index="name"
              ></a-table-column>
              <!-- <a-table-column title="类别">
                <template #cell="{ record }">
                  <a-tag
                    v-if="record.type === 0"
                    bordered
                    color="orangered"
                    >文</a-tag
                  >
                  <a-tag
                    v-else-if="record.type === 1"
                    bordered
                    color="arcoblue"
                    >文</a-tag
                  >
                </template>
              </a-table-column> -->
              <a-table-column
                title="其他信息"
                data-index="description"
              ></a-table-column>

              <a-table-column
                v-if="false"
                title="操作"
              >
                <template #cell="{ record }">
                  <a-button
                    m="r-2"
                    type="outline"
                    status="success"
                    @click="jumpDetail(record)"
                    >详情</a-button
                  >
                  <a-popconfirm
                    v-if="false"
                    content="确定要删除该学科吗？"
                    type="error"
                    @ok="deleteSubject(record)"
                  >
                    <a-button
                      type="primary"
                      status="danger"
                    >
                      <template #icon>
                        <icon-delete />
                      </template>
                      删除
                    </a-button>
                  </a-popconfirm>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-card>
      </a-layout-content>
    </a-layout>
    <a-modal
      v-model:visible="isFormOpen"
      :title="`${formType === 'create' ? '创建' : '更新'}学科`"
      :mask-closable="false"
      :esc-to-close="false"
      :ok-loading="okLoading"
      @ok="handleSubmit"
    >
      <a-form
        ref="formRef"
        :model="form"
      >
        <a-form-item
          field="name"
          label="学科"
        >
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item
          field="description"
          label="其他信息"
        >
          <a-input v-model="form.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
  :deep(.arco-table-container) {
    height: 90%;
  }
</style>
