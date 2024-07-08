/**
 * @description 数据可视化需要的api
 */

import request from '@/utils/request';
import { ListResponse, Paging } from './types';

const schema = '/data';
const statisticsSchema = `${schema}/statistics`;

// 考试详情设计的相关API
const enum statisticsApi {
  classComp = `${statisticsSchema}/classScore`, // 班级成绩对比
  focusStu = `${statisticsSchema}/focusStudent`, // 重点关注学生
  gradeList = `${statisticsSchema}/group/gradeDistribution`, // 成绩分布
  questions = `${statisticsSchema}/questionDifficulty`, // 难点题目
  stuProgress = `${statisticsSchema}/studentProgress`, // 进步学生
  stuRank = `${statisticsSchema}/studentRank`, // 单科考试学生排名，
  groupStuRank = `${statisticsSchema}/group/studentRank`, // group学生排名
  wordCloud = `${statisticsSchema}/wordCount`, // 词云
}

export interface ClassScore {
  average: number;
  classId: number;
  className: string;
  max: number;
  mid: number;
  min: number;
  [property: string]: any;
}

export interface FocusStu {
  classId: number;
  className: string;
  coefficient: number | string;
  current: number;
  last: number;
  name: string;
  [property: string]: any;
}

export interface Grade {
  name: string;
  value: string;
}

export interface ChartQuestion {
  id: number;
  key: string[];
  order: number;
  rate: number | string;
  score: number;
  type: number;
  [property: string]: any;
}

export interface ProgressStu {
  classId: number;
  className: string;
  coefficient: number | string;
  current: number;
  last: number;
  name: string;
  [property: string]: any;
}

export interface StuExamRank {
  classId: number;
  className: string;
  name: string;
  order: number;
  score: number;
  userId: number;
  [property: string]: any;
}

export interface WordCloudItem {
  word: string;
  count: number;
}

/* 考试详情相关API */
export function classScoreApi(data: Paging<{ id: number }>) {
  return request.post<ListResponse<ClassScore>>(statisticsApi.classComp, data);
}

export function focusStuApi(data: Paging<{ id: number; subjectId: number }>) {
  return request.post<ListResponse<FocusStu>>(statisticsApi.focusStu, data);
}

export function gradeListApi(data: { groupId: number; caseRange: { min: number; max: number; name: string }[] }) {
  return request.post<ListResponse<Grade>>(statisticsApi.gradeList, data);
}

export function importantQustionsApi(data: Paging<{ id: number }>) {
  return request.post<ListResponse<ChartQuestion>>(statisticsApi.questions, data);
}

export function stuProgressListApi(data: Paging<{ subjectId: number; id: number }>) {
  return request.post<ListResponse<ProgressStu>>(statisticsApi.stuProgress, data);
}

export function stuExamRankList(data: Paging<{ id: number }>) {
  return request.post<ListResponse<StuExamRank>>(statisticsApi.stuRank, data);
}

/**
 * @description 词云
 * @param id examId或者groupId, 和type配合
 * @param type 1-指定考试, 2-考试组
 */
export function getWordCloudApi(id: number, type: 1 | 2, cache: boolean) {
  return request.post<ListResponse<WordCloudItem>>(statisticsApi.wordCloud, { id, type }, {}, { cache });
}
/* 考试详情相关API */
