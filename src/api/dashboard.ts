import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';
import mockjs, { mock } from 'mockjs';

import request from '@/utils/request';
import { List } from 'echarts';
import { ListResponse } from './types';
import { SubjectItem } from './subject';

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryRecentlyExam(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}

const schema = '/data/system';

const enum SysDataEnum {
  entity = `${schema}/entityCount`,
  examDistri = `${schema}/subjectExamDistribution`,
  problemDistri = `${schema}/subjectProblemDistribution`,
}

/**
 * EntityCount
 */
export interface SystemEntityType {
  classCount: number;
  examCount: number;
  groupCount: number;
  problemCount: number;
  studentCount: number;
  subjectCount: number;
  teacherCount: number;
  userCount: number;
  [property: string]: any;
}

export interface SubjectDistriItem {
  count: number;
  subjectId: number;
  subjectName: string;
  [property: string]: any;
}

/**
 * 获取系统实体数据
 * @returns
 */
export function getSystemEntityApi() {
  return request.post<SystemEntityType>(SysDataEnum.entity, {}, {}, { cache: true });
}

export function getExamDistri() {
  return request.post<ListResponse<SubjectDistriItem>>(SysDataEnum.examDistri);
}

export function getProblemDistri() {
  return request.post<ListResponse<SubjectDistriItem>>(SysDataEnum.problemDistri);
}
