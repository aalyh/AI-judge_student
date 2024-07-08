import request from '@/utils/request/index';
import { Paging } from './types';
import { createFormData } from './utils';

export interface Class {
  id: number;
  name: string;
  grade: string;
  number: string;
  state: number;
  numberCount: number;
  graduation: number;
}

export function createClass(c: Class) {
  return request.post<Class>('/organization/class/create', c);
}

export function deleteClass(id: number) {
  return request.post('/organization/class/delete', { id });
}

export function listClass(
  data: Paging<{
    key: string;
    grade: string;
  }>,
) {
  return request.post<{
    total: number;
    list: Class[];
  }>('/organization/class/list', data);
}

export function updateClass(c: Class) {
  return request.post('/organization/class/update', c);
}

export function uploadClass(file: File, sheet?: string) {
  return request.post('/organization/class/upload', createFormData({ file, sheet }));
}
