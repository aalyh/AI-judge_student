<script setup lang="ts">
  import { UserItem, createUserAPI, deleteUserAPI, getUserListAPI, updateUserAPI } from '@/api/user';
  import { Message } from '@arco-design/web-vue';
  import { cloneDeep, reject } from 'lodash';
  import { useUserStore } from '@/store';
  import { ref, watch } from 'vue';
  import { BaseRole } from '@/types/permissions';
  import { getRoleListAPI, getUserRoleAPI, roleBindUserAPI } from '@/api/permissions';
  import useTable from '@/hooks/table/useTable';

  const otherSearchParams = { key: '' };
  const { key, page, loading, tableData, loadList, handlePageChange, handleSizeChange, pagination } = useTable<
    UserItem,
    typeof otherSearchParams
  >({
    requestApi: getUserListAPI,
    otherSearchParams,
  });

  const defaultAvatar = 'https://img0.baidu.com/it/u=1356523179,1772235027&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500';

  const formType = ref<'create' | 'edit'>('create');
  const isFormOpen = ref(false);
  const formRef = ref();
  const okLoading = ref(false);
  const form = ref<UserItem>({
    id: 0,
    username: '',
    nickname: '',
    password: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const userRole = ref<number[]>([]);
  const { permissions } = useUserStore();
  const roleList = ref<Omit<BaseRole, 'auth'>[]>([]);

  function reset() {
    key.value = '';
    page.value = 1;
    loadList();
  }
  function deleteUser(data: UserItem) {
    const { id } = data;
    deleteUserAPI(id as number).then((res) => {
      const { success } = res;
      if (success) {
        Message.success(`用户${form.value.nickname}已删除`);
        loadList();
      }
    });
  }
  function handleSubmit() {
    const submitFn = formType.value === 'create' ? createUserAPI : updateUserAPI;
    const requests = [submitFn(form.value)];
    if (formType.value === 'edit') {
      requests.push(roleBindUserAPI({ userId: form.value.id as number, roleIds: userRole.value }));
    }
    Promise.allSettled(requests).then((res) => {
      if (res[0].status !== 'fulfilled') {
        Message.error(`用户${form.value.nickname}角色配置失败`);
      } else if (res[1] && res[1].status !== 'fulfilled') {
        Message.error(`用户${form.value.nickname}基础信息修改失败`);
      } else {
        Message.success(`用户${formType.value === 'create' ? '创建' : '更新'}成功`);
      }
      loadList();
    });
  }

  function loadRoleList() {
    getRoleListAPI({ page: 1, pageSize: 100, key: '' }).then((res) => {
      const { list } = res.data;
      roleList.value = list.map((role) => {
        return {
          id: role.id,
          name: role.name,
        };
      });
    });
  }

  function getUserRole(id: number) {
    return new Promise((resolve) => {
      getUserRoleAPI(id)
        .then((res) => {
          let { list } = res.data;
          userRole.value = [];
          list = list ?? [];
          list.forEach((role) => {
            userRole.value.push(role.id);
          });
          resolve(true);
        })
        .catch(() => {
          reject('获取用户角色失败, 请重新尝试');
        });
    });
  }

  async function openForm(type: 'create' | 'edit', data?: UserItem) {
    if (type === 'edit') {
      form.value = cloneDeep(data) as UserItem;
      const { id } = data as UserItem;
      try {
        await getUserRole(id as number);
      } catch (e) {
        Message.error(e as string);
      }
    }
    formType.value = type;
    isFormOpen.value = true;
  }
  watch(
    () => isFormOpen.value,
    (newVal) => {
      if (!newVal) {
        setTimeout(() => {
          if (formRef.value) {
            formRef.value.resetFields();
            userRole.value = [];
            if (Object.prototype.hasOwnProperty.call(form.value, 'id')) {
              delete form.value.id;
            }
          }
        }, 500);
      }
    },
  );

  function pageInit() {
    loadList();
    if (permissions.includes('role-list')) {
      loadRoleList();
    }
  }

  pageInit();
</script>

<template>
  <div>
    <a-layout h="5xl">
      <a-layout-header>
        <a-card>
          <header class="pt-4 pb-8">
            <strong class="text-2xl"> 用户管理 </strong>
          </header>
          <section
            w="full"
            p="x-4"
            flex="~ justify-between items-center"
          >
            <div
              w="1/4"
              flex="~"
            >
              <a-input-search
                v-model="key"
                allow-clear
                placeholder="输入关键字查找用户"
                search-button
                @search="loadList"
              />
              <a-button
                m="l-2"
                @click="reset"
              >
                <template #icon>
                  <icon-refresh />
                </template>
                <template #default> 重置 </template>
              </a-button>
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
                <template #default>创建用户</template>
              </a-button>
            </div>
          </section>
        </a-card>
      </a-layout-header>
      <a-layout-content>
        <a-card>
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
                title="id"
                data-index="id"
                :width="80"
              ></a-table-column>
              <a-table-column
                title="头像"
                :width="150"
              >
                <template #cell="{ record }">
                  <a-avatar>
                    <img
                      alt="avatar"
                      :src="record.avatar || defaultAvatar"
                    />
                  </a-avatar>
                </template>
              </a-table-column>
              <a-table-column
                title="用户名"
                data-index="nickname"
              ></a-table-column>
              <a-table-column
                title="账号"
                data-index="username"
              ></a-table-column>
              <a-table-column
                title="电话"
                data-index="key"
              ></a-table-column>
              <a-table-column
                title="邮箱"
                data-index="email"
                :width="200"
              ></a-table-column>
              <a-table-column title="操作">
                <template #cell="{ record }">
                  <a-button
                    v-if="record.id !== 2"
                    m="r-2"
                    type="outline"
                    status="warning"
                    @click="openForm('edit', record)"
                    >编辑</a-button
                  >
                  <a-popconfirm
                    v-if="record.id !== 2"
                    content="确定要删除该用户吗？"
                    type="error"
                    @ok="deleteUser(record)"
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
      :title="`${formType === 'create' ? '创建' : '更新'}用户`"
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
          field="nickname"
          label="用户名"
        >
          <a-input v-model="form.nickname" />
        </a-form-item>
        <a-form-item
          field="username"
          label="账号"
        >
          <a-input v-model="form.username" />
        </a-form-item>
        <a-form-item
          field="password"
          label="密码"
          placeholder="输入内容则更改密码"
        >
          <a-input v-model="form.password" />
        </a-form-item>
        <a-form-item
          field="phone"
          label="电话号码"
        >
          <a-input v-model="form.phone" />
        </a-form-item>
        <a-form-item
          field="email"
          label="邮箱"
        >
          <a-input v-model="form.email" />
        </a-form-item>
        <a-form-item
          field="role"
          label="权限角色"
        >
          <a-select
            v-model:model-value="userRole"
            :options="roleList"
            :field-names="{ value: 'id', label: 'name' }"
            :style="{ width: '100%' }"
            :disabled="formType === 'create'"
            :placeholder="`${formType === 'create' ? '创建用户后可分配权限角色' : '请为用户分配权限角色'}`"
            multiple
            :scrollbar="true"
          >
          </a-select>
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
