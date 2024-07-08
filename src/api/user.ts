import request from '@/utils/request/index';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { ListResponse, Paging } from './types';

const schema = 'user';
const enum userApi {
  Login = `${schema}/login`,
  Info = `${schema}/info`,
  Logout = `${schema}/logout`,
  create = `${schema}/create`,
  update = `${schema}/update-admin`,
  delete = `${schema}/delete-admin`,
  page = `${schema}/list`,
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UserItem {
  id?: number;
  username: string;
  nickname: string;
  password: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return request.post<LoginRes>(userApi.Login, data, {}, { cache: true });
}

export function logout() {
  return request.post<LoginRes>(userApi.Logout);
}

export function getUserInfo() {
  return request.post<UserState>(userApi.Info, null, {}, { cache: true });
}

export function getMenuList() {
  return request.post<RouteRecordNormalized[]>('/api/user/menu');
}

export function createUserAPI(data: UserItem) {
  return request.post(userApi.create, data);
}

export function updateUserAPI(data: UserItem) {
  return request.post(userApi.update, data);
}

export function deleteUserAPI(id: number) {
  return request.post(userApi.delete, { id });
}

export function getUserListAPI(data: Paging<{ key: string }>) {
  return request.post<ListResponse<UserItem>>(userApi.page, data);
}
