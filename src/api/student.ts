import request, { HttpResponse } from '@/utils/request/index';
import { TableData, PaginationProps } from '@arco-design/web-vue';
import { AxiosResponse } from 'axios';
import { createFormData, withPaging } from './utils';
import { DEFAULT_PAGE_SIZE } from './types';

export interface Student extends TableData {
  id: number;
  number: string;
  name: string;
  sex: number;
  class: string;
  grade: string;
  graduation: number;
  state: number;
}

export const fieldsDescription: { [field in keyof Student]: string } = {
  id: '序号',
  number: '学号',
  name: '姓名',
  sex: '性别',
  class: '班级',
  grade: '年级',
  graduation: '毕业',
  state: '账号启用',
};

export function createStudent(data: Omit<Student, 'id'>) {
  return request.post<Student>('/organization/student/create', data);
}

export function deleteStudent(id: number) {
  return request.post('/organization/student/delete', { id });
}

export async function listStudent(
  data: {
    name?: Student['name'];
    state?: Student['state'];
  } = { state: -1 },
  page = 1,
) {
  const res = await request.post('/organization/student/list', withPaging(data, page));

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
    list: Student[];
    pagination: PaginationProps;
  }>;
}

export function updateStudent(t: Partial<Student>) {
  return request.post<Student>('/organization/student/update', t);
}

export function uploadStudent(file: File, sheet?: string, password?: string) {
  return request.post('/organization/student/upload', createFormData({ file, sheet, password }));
}
