<template>
  <a-layout class="h-full">
    <a-layout-header class="p4">
      <a-card class="px-2">
        <header class="pt-4 pb-8">
          <strong class="text-2xl"> 查询班级 </strong>
        </header>
        <div class="grid grid-cols-[1fr_auto]">
          <a-form :model="form">
            <a-row :gutter="16">
              <!-- <a-col :span="8">
                <a-form-item
                  filed="sate"
                  label="状态"
                  label-col-flex="32px"
                >
                  <a-input
                    v-model="form.state"
                    placeholder="请选择班级状态"
                  ></a-input>
                </a-form-item>
              </a-col> -->
              <!-- <a-col :span="8">
                <a-form-item
                  field="graduation"
                  label="毕业届数"
                  label-col-flex="60px"
                >
                  <a-input
                    v-model="form.graduation"
                    placeholder="请选择毕业年份"
                  ></a-input>
                </a-form-item>
              </a-col> -->
              <!-- <a-col :span="8">
                <a-form-item
                  filed="grade"
                  label="年级"
                  label-col-flex="32px"
                >
                  <a-select placeholder="请选择">
                    <a-option :value="2021">2021</a-option>
                    <a-option :value="2022">2022</a-option>
                    <a-option :value="2023">2023</a-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="name"
                  label="班级"
                  label-col-flex="32px"
                >
                  <a-input
                    v-model="form.name"
                    placeholder="请选择班级"
                  ></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <div class="pl-8 ml-8 mb-[20px] flex flex-col justify-between border-l border-l-solid border-[#E5E6EB]">
            <a-button
              type="primary"
              @click="query"
            >
              <template #icon>
                <icon-search />
              </template>
              <template #default> 查询 </template>
            </a-button>
            <a-button
              class="mt-4"
              @click="reset"
            >
              <template #icon>
                <icon-refresh />
              </template>
              <template #default> 重置 </template>
            </a-button>
          </div>
        </div>
      </a-card>
    </a-layout-header>
    <a-layout-content class="px-4">
      <a-card>
        <header class="py-4 flex gap-4">
          <!-- <addClassModalButton></addClassModalButton> -->
          <importBtn @success="loadList"></importBtn>
        </header>
        <a-table
          class="h-4xl"
          :columns="columns"
          :data="tableData"
          stripe
          :loading="loading"
          page-position="br"
          :pagination="pagination"
          sticky-header
          @page-size-change="handleSizeChange"
          @page-change="handlePageChange"
        >
          <!-- <template #state="{ record: { state } }">
            <a-tag
              v-if="state === '在校'"
              checkable
              color="#00b42a"
              >{{ state }}</a-tag
            >
            <a-tag
              v-else-if="state === '已毕业'"
              checkable
              color="#ff5722"
              >{{ state }}</a-tag
            >
            <a-tag
              v-else-if="state === '毕业班'"
              checkable
              color="#ffb400"
              >{{ state }}</a-tag
            >
          </template> -->
          <template #$operation="{ record }">
            <!-- <detail-button
              :data="record"
              :columns="columns"
            /> -->
            <a-popconfirm
              type="error"
              content="确认要删除？"
              @ok="classDelete(record)"
            >
              <a-button
                type="text"
                status="danger"
              >
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
  import { TableColumnData, Message } from '@arco-design/web-vue';
  import { reactive } from 'vue';
  import addClassModalButton from '@/views/class-mgmt/components/addClassModalButton.vue';
  import importBtn from '@/views/class-mgmt/components/importBtn.vue';
  import DetailButton from '@/components/detail-button/index.vue';
  import useTable from '@/hooks/table/useTable';
  import { listClass, deleteClass, Class } from '@/api/class';

  const form = reactive<{
    state: string;
    graduation: string;
    grade: string;
    name: string;
  }>({
    state: '',
    graduation: '',
    grade: '',
    name: '',
  });

  const otherSearchParams = { key: '', grade: '' };
  const { key, grade, loading, tableData, loadList, handlePageChange, handleSizeChange, pagination } = useTable<
    Class,
    typeof otherSearchParams
  >({
    requestApi: listClass,
    otherSearchParams,
  });

  const columns: TableColumnData[] = Object.entries({
    id: '序号',
    // graduation: '毕业届数',
    name: '班级',
    grade: '当前年级',
    memberCount: '学生人数',
    // classType: '班级类型',
    // state: '班级状态',
    $operation: '操作', // 伪列
  }).map(([dataIndex, title]) => ({ dataIndex, title, slotName: dataIndex }));

  // 获取班级列表数据
  // 查询
  async function query() {
    loading.value = true;
    grade.value = form.grade;
    key.value = form.name;
    await loadList();
    Message.success('数据查询成功');
  }
  // 重置
  async function reset() {
    grade.value = '';
    key.value = '';
    form.grade = '';
    form.name = '';
    await loadList();
    Message.success('数据已更新');
  }
  // 删除
  async function classDelete(record: Class) {
    const { id } = record;
    deleteClass(id as number).then((res) => {
      const { message } = res;
      if (message === 'success') {
        Message.success('删除成功');
        loadList();
      }
    });
  }

  loadList();
</script>
