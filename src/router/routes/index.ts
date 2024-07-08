import { AppRouteRecordRaw } from './types';

// 暂时不渲染出来的路由, 把name配置在这里
const notUse = ['permission-mgmt', 'subject-mgmt'];

export default function formatModules(_modules: any, result: AppRouteRecordRaw[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule || notUse.includes(defaultModule.name)) return;
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}
