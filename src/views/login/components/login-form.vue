<template>
  <div
    class="login-form-wrapper"
    flex="~ col items-center"
  >
    <div
      :class="{
        'custom-loading-jump': loading,
      }"
    >
      <icon-robot
        :size="180"
        color="#293145"
      />
    </div>

    <div class="login-form-title">{{ APP_TITLE }}</div>
    <div class="login-form-sub-title"> </div>
    <div class="login-form-error-msg"></div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="username"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.username"
          size="large"
          placeholder="账号"
        >
          <template #prefix>
            <icon-user :size="20" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          placeholder="密码"
          allow-clear
          size="large"
        >
          <template #prefix>
            <icon-lock :size="20" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space
        :size="16"
        direction="vertical"
      >
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any"
          >
            记住密码
          </a-checkbox>
        </div>
        <a-button
          type="primary"
          html-type="submit"
          long
          :loading="loading"
        >
          登录
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import APP_TITLE from '@/assets/globalVariable';
  import { RouteRecordRaw, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';
  import formatModules from '@/router/routes';
  import { REDIRECT_MAIN } from '@/router/routes/base';

  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    username: 'fate', // 演示默认值
    password: 'fate', // demo default value
  });
  const userInfo = reactive({
    username: loginConfig.value.username,
    password: loginConfig.value.password,
  });

  const handleSubmit = async ({ errors, values }: { errors: Record<string, ValidatedError> | undefined; values: Record<string, any> }) => {
    const { username, password } = values;
    if (!username) {
      Message.error('请输入账号');
      return;
    }
    if (!password) {
      Message.error('请输入密码');
      return;
    }
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        await userStore.login(values as LoginData);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        setTimeout(() => {
          router.push({
            name: (redirect as string) || 'Workplace',
            query: {
              ...othersQuery,
            },
          });
        }, 1200); // 播放完毕加载动画，并留下充足的文件加载时间

        Message.success('欢迎使用');
        const { rememberPassword } = loginConfig.value;
        const { username, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.username = rememberPassword ? username : '';
        loginConfig.value.password = rememberPassword ? password : '';
      } catch (err) {
        setLoading(false);
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };

  onBeforeRouteLeave(() => {
    setLoading(false);
  });
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }

  .login-form-wrapper {
    --normal-dark: #293145;
    .login-form-title {
      color: var(--normal-dark);
      font-weight: 800;
      margin-top: 5px;
    }
    :deep(.arco-btn-primary, .arco-btn-primary[type='button'], .arco-btn-primary[type='submit']) {
      background-color: #98a0b3;
      font-size: 1.2em;
      padding: 20px 15px;
      border-radius: 5px;
      font-weight: 600;
      &:hover {
        background-color: var(--normal-dark);
      }
    }
    :deep(.arco-input) {
      font-size: 1.2em;
      font-weight: 700;
    }
    :deep(.arco-input-wrapper) {
      border-radius: 5px;
      border: 3px solid transparent;
    }
    :deep(.arco-input-wrapper:focus-within, .arco-input-wrapper.arco-input-focus) {
      border-radius: 5px;
      border-color: var(--normal-dark);
    }

    :deep(.arco-checkbox-checked .arco-checkbox-icon) {
      background-color: var(--normal-dark);
      color: white;
    }
  }
</style>
