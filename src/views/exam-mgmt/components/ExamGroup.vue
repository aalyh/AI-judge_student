<script setup lang="ts">
  /**
   *@description 考试组crud
   */
  import { ref, defineAsyncComponent } from 'vue';
  import useTable from '@/hooks/table/useTable';
  import { submitGroupResApi, getGroupList, type Group, deleteGroupApi } from '@/api/exam';
  import { type FormType } from '@/hooks/table/useForm';
  import { Message } from '@arco-design/web-vue';
  import { examStateMap } from '../config';

  const GroupForm = defineAsyncComponent(() => import('./groupForm.vue'));
  const emits = defineEmits<{
    (e: 'onChange'): void;
  }>();
  const now = new Date().getTime();
  const otherSearchParams = { key: '', order: 1 };
  const { key, order, tableData, page, loading, pagination, loadList, handlePageChange, handleSizeChange, handleDelete, setLoading } =
    useTable<Group, typeof otherSearchParams>({
      requestApi: getGroupList,
      deleteApi: deleteGroupApi,
      otherSearchParams,
    });
  const formCfg = ref({
    visible: false,
    formType: 'create' as FormType,
    formData: {} as Group,
  });
  const openForm = (type: FormType, data?: Group) => {
    if (type === 'edit' && data) {
      formCfg.value.formData = data;
    } else {
      formCfg.value.formData = {} as Group;
    }
    formCfg.value.formType = type;
    formCfg.value.visible = true;
  };
  const handleFormClose = () => {
    formCfg.value = {
      visible: false,
      formType: 'create' as FormType,
      formData: {} as Group,
    };
  };

  const submitGroupRes = (groupId: number, groupName: string) => {
    setLoading(true);
    submitGroupResApi(groupId)
      .then((res) => {
        const { success } = res;
        if (success) {
          Message.success(`考试组 ${groupName} 阅卷信息提交成功`);
          loadList();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setupComp = () => {
    loadList();
  };

  setupComp();
</script>

<template>
  <div>
    <a-layout
      h="full"
      flex="~ col items-center justify-start"
    >
      <a-layout-header class="w-1/1">
        <a-card>
          <header class="pt-4 pb-8">
            <strong class="text-2xl"> 考试组配置 </strong>
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
                placeholder="输入关键字查询"
                search-button
                @search="loadList"
              />
            </div>
            <div w="1/4">
              <a-button
                type="primary"
                @click="openForm('create')"
              >
                <template #icon>
                  <icon-plus-circle />
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>新建</template>
              </a-button>
            </div>
          </section>
        </a-card>
      </a-layout-header>
      <a-layout-content class="flex-1">
        <a-card h="full">
          <a-table
            :data="tableData"
            class="h-4xl"
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
                title="考试组"
                data-index="name"
              ></a-table-column>
              <a-table-column
                title="状态"
                data-index="state"
              >
                <template #cell="{ record }">
                  <a-tag :color="examStateMap[record.state].iconColor">
                    {{ examStateMap[record.state].groupState }}
                  </a-tag>
                </template>
              </a-table-column>
              <a-table-column
                title="开考日期"
                data-index="time"
              >
                <template #cell="{ record }">
                  {{ new Date(record.time).toLocaleString().slice(0, 9).replace(/\//g, '-') }}
                </template>
              </a-table-column>
              <a-table-column
                title="结束日期"
                data-index="timeLimit"
              >
                <template #cell="{ record }">
                  {{ new Date(record.timeLimit).toLocaleString().slice(0, 9).replace(/\//g, '-') }}
                </template>
              </a-table-column>
              <a-table-column
                title="其他信息"
                data-index="description"
                :width="100"
              >
                <template #cell="{ record }">
                  <a-popover title="附加信息">
                    <icon-info-circle :size="20" />
                    <template #content>
                      {{ record.description || '暂无额外附加信息' }}
                    </template>
                  </a-popover>
                </template>
              </a-table-column>
              <a-table-column
                title="操作"
                :width="300"
              >
                <template #cell="{ record }">
                  <a-button
                    v-if="now > record.timeLimit && record.state !== 4"
                    m="r-2"
                    type="primary"
                    status="success"
                    @click="submitGroupRes(record.id, record.name)"
                    >提交结果</a-button
                  >
                  <a-button
                    v-if="now < record.time"
                    m="r-2"
                    type="outline"
                    status="warning"
                    @click="openForm('edit', record)"
                    >更新</a-button
                  >
                  <a-popconfirm
                    :content="`确定删除该考试组${record.name}吗？`"
                    type="error"
                    @ok="
                      () => {
                        handleDelete(record);
                        emits('onChange');
                      }
                    "
                  >
                    <a-button
                      v-if="now < record.time"
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
    <GroupForm
      :form-cfg="formCfg"
      :load-table="loadList"
      @on-close="handleFormClose"
    />
  </div>
</template>
