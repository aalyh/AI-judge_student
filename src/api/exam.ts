import request from '@/utils/request';
import { ExamStateEnum } from '@/views/exam-mgmt/config';
import { ListResponse, Paging } from './types';
import { Question } from './question';

const schema = '/study/exam';

// 考试本体crud接口
const enum ExamApi {
  create = `${schema}/create`,
  update = `${schema}/update`,
  delete = `${schema}/delete`,
  list = `${schema}/list`,
  detail = `${schema}/detail`,
  addProblem = `${schema}/addProblem`,
  uploadTemplate = `${schema}/upload`, // 上传考试excel模板
  uploadAnswerSheet = `${schema}/answerSheet/upload`, // 上传答题卡zip
  sheetList = `${schema}/answerSheet/list`, // 获取上传到某考试中的学生的答题卡列表
  problemList = `${schema}/problemList`,
  joinExamClassList = `${schema}/classList`, // 参加考试的班级列表
}

// 考试组crud接口
const groupSchema = `${schema}/group`;
const enum ExamGroupApi {
  creat = `${groupSchema}/create`,
  update = `${groupSchema}/update`,
  list = `${groupSchema}/list`,
  delete = `${groupSchema}/delete`,
  submit = `${groupSchema}/calculate`, // 提交考试组全部数据, mobile需要
}

// 试题卷试题增删
const enum ExamQuestionApi {
  editQuestion = `${schema}/addProblem`,
}

/**
 * ExamUpdateReq
 */
export interface ExamFormData {
  description: string;
  id?: number;
  groupId: number | null;
  name: string;
  state: number | undefined;
  subject: number | undefined;
  time: number | undefined;
  timeLimit: number;
  type: number | undefined;
  [property: string]: any;
}

export interface ExamFileParams {
  file: File;
  sheet?: string;
  examId: number;
}

export interface addProblemParams {
  examId: number;
  problemId: number;
  score: number;
  order: number;
  type: false;
}

export interface ExamListItem {
  id: number;
  name: string;
  groupId: number;
  groupName: string;
  description: string;
  state: number;
  type: number;
  subject: string;
  subjectId: number;
  time: number;
  timeLimit: number;
  total?: number;
  number?: number;
}

export interface AnswerSheetItem {
  exam: number;
  examId: number;
  id?: number;
  score: number;
  state: number;
  student: {
    id: number;
    name: string;
    number: string;
    [property: string]: any;
  };
  url: string;
  [property: string]: any;
}

export interface JoinExamClassItem {
  classId: number;
  className: string;
  code: string;
  grade: number;
  [property: string]: any;
}

export function createExamApi(data: Omit<ExamFormData, 'id'>) {
  return request.post(ExamApi.create, data);
}

export function updateExamApi(data: ExamFormData) {
  return request.post(ExamApi.update, data);
}

export function deleteExamApi(id: number) {
  return request.post(ExamApi.delete, { id });
}

export function getExamListApi(
  data: Paging & { key: string; state: Omit<ExamStateEnum, 'beforeStart'>; subjectId: number; groupId: number },
) {
  return request.post<ListResponse<ExamListItem>>(ExamApi.list, data);
}

export function uploadExamTemplateApi({ file, sheet = '', examId }: ExamFileParams) {
  return request.upload(ExamApi.uploadTemplate, file, { sheet, examId });
}

export function uploadAnswerSheetApi({ file, examId }: ExamFileParams) {
  return request.upload(ExamApi.uploadAnswerSheet, file, { examId });
}

export function addProblemApi(data: addProblemParams) {
  return request.post(ExamApi.addProblem, data);
}

export function getAnswerSheetListApi(data: Paging<{ examId: number; key?: string }>) {
  return request.post<ListResponse<AnswerSheetItem>>(ExamApi.sheetList, data);
}

export function getExamDetailApi(data: { id: number }) {
  return request.post<ExamListItem>(ExamApi.detail, data);
}
/**
 * 参加考试的班级列表
 * @param examId 考试id
 * @returns
 */
export function getJoinExamClassListApi(examId: number) {
  return request.post<ListResponse<JoinExamClassItem>>(ExamApi.joinExamClassList, { page: 1, pageSize: 500, examId });
}

export interface Group {
  id: number;
  description: string;
  name: string;
  state: number | null;
  time: number | string;
  timeLimit: number | string;
  [property: string]: any;
}

export function createGroupApi(data: Omit<Group, 'id'>) {
  return request.post(ExamGroupApi.creat, data);
}

export function updateGroupApi(data: Group) {
  return request.post(ExamGroupApi.update, data);
}
// order: 1-升序, 其他数字-降序
// state: 0-全部, 4-已提交, 1-未提交
export function getGroupList(data: Paging<{ key: string; order: number; state?: number }>) {
  const groupState = typeof data.state === 'number' ? data.state : 0;
  return request.post<ListResponse<Group>>(ExamGroupApi.list, { ...data, state: groupState });
}

export function deleteGroupApi(id: number) {
  return request.post(ExamGroupApi.delete, { id });
}

export function submitGroupResApi(groupId: number) {
  return request.post(ExamGroupApi.submit, { id: groupId });
}

export function getProblemList(examId: number) {
  return request.post<ListResponse<Question>>(ExamApi.problemList, { examId });
}

/**
 * 新增 / 替换原试卷的题目
 * @param data
 * @returns
 */
export function addPaperQuestion(data: { examId: number; problemId: number; score: number; order: number }) {
  return request.post(ExamQuestionApi.editQuestion, { type: false, ...data });
}

/**
 * 删除试题卷中指定试题
 * @param data
 * @returns
 */
export function deletePaperQuestion(data: { examId: number; problemId: number; score: number; order: number }) {
  return request.post(ExamQuestionApi.editQuestion, { type: true, ...data });
}
