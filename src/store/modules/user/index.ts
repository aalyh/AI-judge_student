import { defineStore } from 'pinia';
import { login as userLogin, logout as userLogout, getUserInfo, LoginData } from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

function getPageAuth(originAuth: string[]) {
  const pageAuth: string[] = [];
  originAuth.forEach((auth) => {
    if (auth.includes('-')) {
      const permissions = auth.split('-');
      pageAuth.push(...permissions.slice(0, permissions.length - 1));
    } else {
      pageAuth.push(auth);
    }
  });
  return [...new Set(pageAuth)];
}

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    username: '',
    avatar: '',
    nickname: '',
    email: '',
    auth: [],
    permissions: [],
    removeRouteFns: [],
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
      this.auth = getPageAuth(partial.auth as string[]);
      this.permissions = partial.auth;
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const { data } = await getUserInfo();
      await this.setInfo(data);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
        this.removeAsyncRoutes();
      } finally {
        this.logoutCallBack();
      }
    },
    setRemoveAsyncRouteFns(fns: any[]) {
      this.removeRouteFns = fns;
    },
    removeAsyncRoutes() {
      this.removeRouteFns.forEach((removeFn) => {
        removeFn();
      });
    },
  },
});

export default useUserStore;
