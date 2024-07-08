import { NestArr } from '@/api/types';

/**
 * @description 抽取一个嵌套的对象数组里指定key的值, 组成新数组返回
 * @param target
 * @param key
 */
export function getSpecificValueArr(target: NestArr<any>, key: string, cb?: (...args: any[]) => any): any[] {
  const res = [];
  const origin = Array.isArray(target) ? target : [target];
  origin.forEach((item) => {
    const resItem = cb ? cb(item[key]) : item[key];
    res.push(resItem);
    if (Array.isArray(item.children)) {
      res.push(...getSpecificValueArr(item.children, key));
    }
  });
  return res;
}

/**
 * 检查否存在交集
 * @param arr1
 * @param arr2
 * @returns boolean
 */
export function checkPermissionIntersection(userAuth: string[], needPermissions: string[]) {
  if (!userAuth.length || !needPermissions.length) {
    return false;
  }
  if (userAuth.includes('root')) {
    return true;
  }
  const s = new Set(userAuth);
  return needPermissions.some((item) => s.has(item));
}

/**
 * 数组扁平化
 * @param NestArr 应当有children
 * @returns
 */
export function flatten<T extends object>(NestArr: NestArr<T>): T[] {
  let res = [] as unknown as NestArr;
  const out: T[] = [];

  res = res.concat(NestArr);
  while (res.length) {
    const fir = res.shift();
    if (fir.children && fir.children.length) {
      res = res.concat(fir.children);
    }
    out.push(fir);
  }
  return out;
}
