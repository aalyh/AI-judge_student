import request from '@/utils/request';
import { ListResponse } from './types';

export interface AnswerItem {
  id: number;
  problemId: number;
  answer: string;
}

const schema = '/study/answer/';

enum AnswerApi {
  create = `${schema}/create`,
  update = `${schema}/update`,
  delete = `${schema}/delete`,
  list = `${schema}/list`,
}

export function getAnswerListApi(problemId: number) {
  return request.post<ListResponse<AnswerItem>>(AnswerApi.list, { page: 1, pageSize: 50, problemId });
}

export function createAnswerApi(data: Omit<AnswerItem, 'id'>) {
  return request.post(AnswerApi.create, data);
}

export function updateAnswerApi(data: AnswerItem) {
  return request.post(AnswerApi.update, data);
}

export function deleteAnswerApi(id: number) {
  return request.post(AnswerApi.delete, { id });
}
