<script setup lang="ts">
  import { ref, defineAsyncComponent, watch } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import useTable from '@/hooks/table/useTable';
  import { deleteExamApi, getExamListApi, getGroupList } from '@/api/exam';
  import type { ExamFormData, ExamListItem } from '@/api/exam';
  import { getSubjectListAPI } from '@/api/subject';
  import { ExamStateEnum, examStateMap } from './config';

  /* 考试table crud */
  const ExamFormModal = defineAsyncComponent(() => import('./components/formModal.vue'));
  const ExamGroup = defineAsyncComponent(() => import('./components/ExamGroup.vue'));
  const now = new Date().getTime();
  const router = useRouter();
  const otherSearchParams = { key: '', groupId: 0, subjectId: 0, state: ExamStateEnum.default };
  const { key, groupId, subjectId, state, loading, page, tableData, pagination, loadList, handleSizeChange, handlePageChange } = useTable<
    ExamListItem,
    typeof otherSearchParams
  >({
    requestApi: getExamListApi,
    otherSearchParams,
  });

  const subjectOptions = ref<{ name: string; id: number | string }[]>([{ name: '全部', id: 0 }]);

  function initSelect() {
    getSubjectListAPI({ page: 1, pageSize: 100, key: '' }, { cache: true })
      .then((res) => {
        const { list } = res.data;
        list.forEach((item) => {
          subjectOptions.value.push({
            id: item.id as number,
            name: item.name,
          });
        });
      })
      .catch(() => {
        Message.error('学科信息获取失败, 请刷新页面重试');
      });
  }

  function reset() {
    key.value = '';
    page.value = 1;
    groupId.value = 0;
    subjectId.value = 0;
    state.value = 0;
    loadList();
  }
  const isFormOpen = ref(false);
  const formType = ref<'create' | 'edit'>('create');
  const form = ref<ExamFormData>({
    groupId: null,
    description: '',
    name: '',
    state: undefined,
    subject: undefined,
    time: undefined,
    timeLimit: 0,
    type: undefined,
  });
  async function openForm(type: 'create' | 'edit', data?: ExamFormData) {
    if (type === 'edit') {
      form.value = data as ExamFormData;
    }
    formType.value = type;
    isFormOpen.value = true;
  }

  function deleteSubject(data: ExamListItem) {
    const { id } = data;
    deleteExamApi(id as number).then((res) => {
      const { code } = res;
      if (code === 200) {
        Message.success('删除成功');
        loadList();
      }
    });
  }
  function jumpDetail(query: ExamListItem) {
    router.push({
      path: '/exam-mgmt/examDetail',
      query,
    });
  }
  const handleSubmitSuccess = () => {
    isFormOpen.value = false;
    loadList();
  };
  /* 考试table crud */

  /* 考试组 逻辑 */
  const isGroupTableVisible = ref(false);
  // 考试组初始化
  const groupOpts = ref<{ label: string; value: number }[]>([]);
  const initGroupSelectData = () => {
    getGroupList({ page: 1, pageSize: 100, key: '', order: 1 })
      .then((res) => {
        const { list } = res.data;
        groupOpts.value = list.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        groupOpts.value.unshift({
          label: '近期全部考试组',
          value: 0,
        });
      })
      .catch((e) => {
        Message.error('考试组数据获取失败, 请稍后重试');
      });
  };
  const openGroup = () => {
    if (!groupOpts.value.length) {
      initGroupSelectData();
    }
    isGroupTableVisible.value = true;
  };
  const closeGroup = () => {
    isGroupTableVisible.value = false;
  };
  watch(
    () => isGroupTableVisible.value,
    (newVal) => {
      if (!newVal) {
        initGroupSelectData();
      }
    },
  );
  /* 考试组 逻辑 */
  const initPage = () => {
    initSelect();
    initGroupSelectData();
    loadList();
  };

  initPage();
</script>

<template>
  <div>
    <a-layout h="full">
      <a-layout-header>
        <a-card>
          <header class="pt-4 pb-8">
            <strong class="text-2xl"> 考试管理 </strong>
          </header>
          <div class="grid grid-cols-[1fr_auto]">
            <a-form :model="form">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item
                    field="groupId"
                    label="考试组"
                    label-col-flex="60px"
                  >
                    <a-select
                      v-model:model-value="groupId"
                      m="l-10"
                      :options="groupOpts"
                      allow-search
                      placeholder="输入关键词搜索"
                    >
                      <template #label="{ data }">
                        <span>{{ data.label }}</span>
                      </template>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    field="title"
                    label="考试名称"
                  >
                    <a-input
                      v-model="form.title"
                      placeholder="考试名称查询"
                    ></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    filed="subject"
                    label="学科"
                    label-col-flex="32px"
                  >
                    <a-select
                      v-model="subjectId"
                      :options="subjectOptions"
                      :field-names="{ label: 'name', value: 'id' }"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item
                    filed="state"
                    label="考试状态"
                    label-col-flex="64px"
                  >
                    <a-select v-model:model-value="state">
                      <a-option :value="0">全部</a-option>
                      <!-- <a-option :value="1">
                        <a-tag>数据录入</a-tag>
                      </a-option> -->
                      <a-option :value="ExamStateEnum.aiJudging">
                        <a-tag :color="examStateMap[ExamStateEnum.aiJudging].iconColor"
                          ><i
                            class="mr-2"
                            :class="examStateMap[ExamStateEnum.aiJudging].stepIcon"
                          ></i
                          >{{ examStateMap[ExamStateEnum.aiJudging].text }}</a-tag
                        >
                      </a-option>
                      <a-option :value="ExamStateEnum.aiDone">
                        <a-tag :color="examStateMap[ExamStateEnum.aiDone].iconColor"
                          ><i
                            class="mr-2"
                            :class="examStateMap[ExamStateEnum.aiDone].stepIcon"
                          ></i
                          >{{ examStateMap[ExamStateEnum.aiDone].text }}</a-tag
                        >
                      </a-option>
                      <a-option :value="ExamStateEnum.checking">
                        <a-tag :color="examStateMap[ExamStateEnum.checking].iconColor"
                          ><i
                            class="mr-2"
                            :class="examStateMap[ExamStateEnum.checking].stepIcon"
                          ></i
                          >{{ examStateMap[ExamStateEnum.checking].text }}</a-tag
                        >
                      </a-option>
                      <a-option :value="ExamStateEnum.complete">
                        <a-tag :color="examStateMap[ExamStateEnum.complete].iconColor"
                          ><i
                            class="mr-2"
                            :class="examStateMap[ExamStateEnum.complete].stepIcon"
                          ></i
                          >{{ examStateMap[ExamStateEnum.complete].text }}</a-tag
                        >
                      </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <div class="pl-8 ml-8 mb-[20px] flex flex-col justify-between border-l border-l-solid border-[#E5E6EB]">
              <a-button
                type="primary"
                @click="loadList"
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

      <a-layout-content>
        <a-card
          h="full"
          flex="~ col"
        >
          <section
            w="full"
            p="x-4"
            flex="~ justify-between items-center"
            m="b-3"
          >
            <div w="1/4">
              <a-tooltip content="创建考试前, 请先创建对应考试组, 以便正常使用数据分析功能">
                <a-button
                  type="primary"
                  @click="openForm('create')"
                >
                  <template #icon>
                    <icon-plus-circle />
                  </template>
                  <!-- Use the default slot to avoid extra spaces -->
                  <template #default>创建考试</template>
                </a-button>
              </a-tooltip>

              <a-tooltip content="新建考试所属阶段, 如第三周测试、第一学月月考......">
                <a-button
                  type="outline"
                  status="warning"
                  class="ml-3"
                  @click="openGroup"
                >
                  <template #icon>
                    <icon-plus-circle />
                  </template>
                  <!-- Use the default slot to avoid extra spaces -->
                  <template #default>考试组管理</template>
                </a-button>
              </a-tooltip>
            </div>
          </section>
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
                title="考试组"
                :width="350"
                data-index="groupName"
              ></a-table-column>
              <a-table-column
                title="考试"
                data-index="name"
                :width="350"
              >
                <template #cell="{ record }">
                  <span class="font-bold text-1em">{{ record.name }}</span>
                </template>
              </a-table-column>
              <a-table-column
                title="学科"
                data-index="subject"
                :width="100"
              >
              </a-table-column>
              <a-table-column
                title="分类"
                :width="100"
              >
                <template #cell="{ record }">
                  <a-tag
                    bordered
                    :color="`${record.type === 0 ? 'orangered' : 'arcoblue'}`"
                    >{{ record.type === 0 ? '文' : '理' }}</a-tag
                  >
                </template>
              </a-table-column>
              <a-table-column
                title="状态"
                data-index="state"
                :width="120"
              >
                <template #cell="{ record }">
                  <a-tag
                    :color="
                      now <= record.timeLimit ? examStateMap[ExamStateEnum.beforeStart].iconColor : examStateMap[+record.state].iconColor
                    "
                  >
                    <i
                      class="mr-2"
                      :class="
                        now <= record.timeLimit ? examStateMap[ExamStateEnum.beforeStart].stepIcon : examStateMap[+record.state].stepIcon
                      "
                    ></i>
                    {{ now <= record.timeLimit ? examStateMap[ExamStateEnum.beforeStart].text : examStateMap[+record.state].text }}
                  </a-tag>
                </template>
              </a-table-column>
              <a-table-column
                title="开考时间"
                :width="200"
                data-index="time"
              >
                <template #cell="{ record }">
                  {{ new Date(record.time).toLocaleString().replace(/\//g, '-').slice(0, 15) }}
                </template>
              </a-table-column>
              <a-table-column
                v-if="false"
                title="交卷时间"
                :width="200"
                data-index="time"
              >
                <template #cell="{ record }">
                  {{ new Date(record.timeLimit).toLocaleString().replace(/\//g, '-').slice(0, 15) }}
                </template>
              </a-table-column>
              <a-table-column
                title="考试时长"
                data-index="timeLimit"
                :width="120"
              >
                <template #cell="{ record }"> {{ ((record.timeLimit - record.time) / (1000 * 60)).toFixed() }}分钟 </template>
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
                :width="250"
              >
                <template #cell="{ record }">
                  <a-button
                    m="r-2"
                    type="outline"
                    status="success"
                    @click="jumpDetail(record)"
                    >详情</a-button
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
                    content="确定要删除该学科吗？"
                    type="error"
                    @ok="deleteSubject(record)"
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
    <ExamFormModal
      :create="formType"
      :visible="isFormOpen"
      :form-data="form"
      @on-cancel="isFormOpen = false"
      @on-succes="handleSubmitSuccess"
    />
    <a-drawer
      placement="right"
      :esc-to-close="false"
      :mask-closable="false"
      :visible="isGroupTableVisible"
      unmount-on-close
      width="60%"
      ok-text="退出"
      hide-cancel
      @cancel="closeGroup"
      @ok="closeGroup"
    >
      <template #title> 考试组管理 </template>
      <ExamGroup />
    </a-drawer>
  </div>
</template>

<style scoped lang="less">
  :deep(.arco-table-container) {
    height: 90%;
  }
</style>
