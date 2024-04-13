import request from "@/utils/axios/axios";
const schema = "mobile/study/exam";

const enum examAPI {
  Answersheet = `${schema}/answerSheet`,
  DetailAll = `${schema}/detailAll`,
  GroupList = `${schema}/group/list`,
  Trend = `${schema}/trend`,
  TrendAll = `${schema}/trendAll`,
}

type Paging<T extends object = object> = T & {
  page: number;
  pageSize: number;
};

//获取阅卷结果
export function getAnswersheet(examId: number) {
  return request.post({
    url: examAPI.Answersheet,
    data: { examId },
  });
}
//获取整体考试详情
export function getDetailAll(id: number) {
  return request.post({
    url: examAPI.DetailAll,
    data: { id },
  });
}
//获取考试列表
export function getGroupList(data: Paging<{ key: string }>) {
  return request.post({
    url: examAPI.GroupList,
    data,
  });
}
//获取单科考试趋势
export function getTrend(data: Paging<{ subjectId: string }>) {
  return request.post({
    url: examAPI.Trend,
    data,
  });
}
//获取整体考试趋势
export function getTrendAll(data: Paging) {
  return request.post({
    url: examAPI.TrendAll,
    data,
  });
}
