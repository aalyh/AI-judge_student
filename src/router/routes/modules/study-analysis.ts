import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const STUDY_ANALYSIS: AppRouteRecordRaw = {
  path: '/study-analysis',
  name: 'study-analysis',
  component: DEFAULT_LAYOUT, // TODO: replace me
  meta: {
    locale: '学情分析',
    requiresAuth: true,
    icon: 'icon-check-circle',
    order: 7,
  },
};

export default STUDY_ANALYSIS;
