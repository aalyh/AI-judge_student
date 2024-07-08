interface stateConfig {
  value: number;
  text: string;
  groupState: string;
  iconColor: string;
  btnText: string;
  btnIcon: string;
  desc: string;
  stepIcon: string;
}

// 考试整体状态的枚举
export const enum ExamStateEnum {
  beforeStart = -1, // 考试结束前
  default = 0, // 默认值, 创建时候的默认值, 同时也是答题卡上传期间, 没有启动阅卷的状态
  aiJudging = 1, // AI判卷中
  aiDone = 2, // AI判卷结束
  checking = 3, // 复审中
  complete = 4, // 复审结束并完成提交
}

type ExamStateMap = {
  [key in ExamStateEnum]: stateConfig;
};

export const examStateMap: ExamStateMap = {
  [ExamStateEnum.beforeStart]: {
    value: ExamStateEnum.beforeStart,
    text: '筹备中',
    groupState: '等待考试开始',
    iconColor: '#ff5722',
    btnText: '上传试题卷',
    btnIcon: 'i-tabler:align-box-left-middle',
    desc: '等待考试结束',
    stepIcon: 'i-tabler:align-box-left-middle',
  },
  [ExamStateEnum.default]: {
    value: ExamStateEnum.default,
    text: '答题卡录入',
    groupState: '考试结束',
    iconColor: '#00b42a',
    btnText: '上传答题卡',
    btnIcon: 'i-tabler:notebook',
    desc: '录入学生答题卡',
    stepIcon: 'i-tabler:notebook',
  },
  [ExamStateEnum.aiJudging]: {
    value: ExamStateEnum.aiJudging,
    text: 'AI阅卷中',
    groupState: '进行中',
    iconColor: 'orangered',
    btnText: '请等待AI阅卷结束',
    btnIcon: 'i-tabler:robot',
    desc: '请等待AI阅卷结束',
    stepIcon: '',
  },
  [ExamStateEnum.aiDone]: {
    value: ExamStateEnum.aiDone,
    text: 'AI阅卷完成',
    groupState: '阅卷中',
    iconColor: 'purple',
    btnText: '人工复审',
    btnIcon: '',
    desc: '查看AI阅卷结果',
    stepIcon: 'i-tabler:robot-face',
  },
  [ExamStateEnum.checking]: {
    value: ExamStateEnum.checking,
    text: '复审',
    groupState: '阅卷中',
    iconColor: '#168cff',
    btnText: '人工复审',
    btnIcon: 'i-tabler:checks',
    desc: '确定最终成绩',
    stepIcon: 'i-tabler:checklist',
  },
  [ExamStateEnum.complete]: {
    value: ExamStateEnum.complete,
    text: '阅卷完毕',
    groupState: '已结束',
    iconColor: '#86909c',
    btnText: '数据分析',
    btnIcon: 'i-tabler:chart-histogram',
    desc: '数据报表',
    stepIcon: 'i-tabler:navigation-check',
  },
};

// 题目type映射
export const questionTypeMap: Record<number, string> = {
  0: '简答',
  1: '填空',
  2: '选择',
  3: '判断',
};

// 学生答卷state枚举
export const enum StuPaperStateEnum {
  newPaper = 0, // 试卷已录入, 未处理
  juding = 1, // AI判卷中
  judged = 2, // AI判卷结束
  checked = 3, // 复审结束
  submitted = 4, // 提交复审结果, 该试卷走完全部周期
}

type StuStateMap = {
  [key in StuPaperStateEnum]: any;
};

// 学生答卷state信息映射
export const stuPaperStateMap: StuStateMap = {
  [StuPaperStateEnum.newPaper]: {},
  [StuPaperStateEnum.juding]: {},
  [StuPaperStateEnum.judged]: {},
  [StuPaperStateEnum.checked]: {},
  [StuPaperStateEnum.submitted]: {},
};
