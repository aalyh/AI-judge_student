import request from '@/utils/request/index';
import { PermissionType } from '@/store/modules/user/types';
import { BaseRole, PermissionItem } from '@/types/permissions';
import { ListResponse, NestArr, Paging } from './types';

const schemaPermission = 'permissions';
const enum PermissionsApi {
  tree = `${schemaPermission}/tree`,
  create = `${schemaPermission}/schema`,
  delete = `${schemaPermission}/delete`,
  update = `${schemaPermission}/update`,
  getById = `${schemaPermission}/get`,
  getByRole = `${schemaPermission}/getByRole`,
  page = `${schemaPermission}/list`,
}

const schemaRole = 'role';
const enum RoleApi {
  create = `${schemaRole}/create`,
  delete = `${schemaRole}/delete`,
  page = `${schemaRole}/list`,
  update = `${schemaRole}/update`,
  bind = `${schemaRole}/bindToUser`,
  linkedUser = `${schemaRole}/getByuser`,
}

export function createPermissionAPI(data: PermissionType) {
  return request.post(PermissionsApi.create, data);
}

export function getPermissionTreeAPI() {
  return request.post<NestArr<PermissionItem>[]>(PermissionsApi.tree, null, {}, { cache: true });
}

export function updatePermissionAPI(data: PermissionType) {
  return request.post(PermissionsApi.update, data);
}

export function deletePermissionAPI(ids: { id: any }) {
  return request.post(PermissionsApi.delete, ids);
}

export function createRoleAPI(data: BaseRole) {
  return request.post(RoleApi.create, data);
}

export function deleteRoleAPI(id: number) {
  return request.post(RoleApi.delete, { id, force: true });
}

export function updateRoleAPI(data: BaseRole) {
  return request.post(RoleApi.update, data);
}

export function getRoleListAPI(data: Paging<{ key: string }>) {
  return request.post<ListResponse<Omit<BaseRole, 'auth'>>>(RoleApi.page, data);
}

export function getUserRoleAPI(id: number) {
  return request.post<ListResponse<Omit<BaseRole, 'auth'>>>(RoleApi.linkedUser, { id });
}

export function roleBindUserAPI(data: { userId: number; roleIds: number[] }) {
  return request.post(RoleApi.bind, { ...data, isBind: true });
}

export function getByRoleAPI(id: number) {
  return request.post<ListResponse<NestArr<PermissionItem>>>(PermissionsApi.getByRole, { id });
}
