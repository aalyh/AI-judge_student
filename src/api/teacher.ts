import request, { HttpResponse } from '@/utils/request/index';
import { PaginationProps, TableData } from '@arco-design/web-vue';
import { AxiosResponse } from 'axios';
import { createFormData, withPaging } from './utils';
import { DEFAULT_PAGE_SIZE } from './types';

// TODO: {field: value}
export interface Teacher extends TableData {
  id: number;
  name: string;
  phone: string;
  number: string;
  sex: number;
  state: number;
  /**
   * timestamp, use new Date()
   */
  createdAt: number;
}

/**
 * 字段转换为可读格式
 */
export const fieldsDescription: { [field in keyof Teacher]: string } = {
  id: '序号',
  name: '姓名',
  phone: '手机号',
  number: '教工号',
  sex: '性别',
  state: '账号启用',
  createdAt: '创建时间',
} as const;

export function createTeacher(data: Omit<Teacher, 'id'>) {
  return request.post<Teacher>('/organization/teacher/create', data);
}

export function deleteTeacher(id: number) {
  return request.post('/organization/teacher/delete', { id });
}

export async function listTeacher(
  data: {
    name?: Teacher['name'];
    state?: Teacher['state'];
  } = { state: -1 },
  page = 1,
) {
  const res = await request.post('/organization/teacher/list', withPaging(data, page));

  return {
    ...res,
    data: {
      ...res.data,
      pagination: {
        total: res.data.total,
        pageSize: DEFAULT_PAGE_SIZE,
      },
    },
  } as HttpResponse<{
    list: Teacher[];
    pagination: PaginationProps;
  }>;
}

export function updateTeacher(data: Partial<Teacher>) {
  return request.post<Teacher>('/organization/teacher/update', data);
}

export function uploadTeacher(file: File, sheet?: string, password?: string) {
  return request.post('/organization/teacher/upload', createFormData({ file, sheet, password }));
}
