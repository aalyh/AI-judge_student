export const enum QuestionTypeEnum {
  shortAnswer = 1,
  choice = 0,
  // blank = 2,
}

export interface QuestionTypeConfig {
  value: QuestionTypeEnum;
  label: string;
  tagColor: string;
}

type QuestionTypeConfigMap = {
  [key in QuestionTypeEnum]: QuestionTypeConfig;
};

// 试题类型配置映射
export const QuestionTypeConfigMap: QuestionTypeConfigMap = {
  [QuestionTypeEnum.shortAnswer]: {
    value: QuestionTypeEnum.shortAnswer,
    label: '简答题',
    tagColor: '#0fc6c2',
  },
  [QuestionTypeEnum.choice]: {
    value: QuestionTypeEnum.choice,
    label: '选择题',
    tagColor: '#ff7d00',
  },
  // [QuestionTypeEnum.blank]: {
  //   value: QuestionTypeEnum.blank,
  //   label: '填空题',
  // },
};
