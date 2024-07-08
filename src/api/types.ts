/**
 * Share utilities for API
 */

/**
 * 默认每页数量
 * 要获取总页数， Math.floor(total / pageSize)
 */
export const DEFAULT_PAGE_SIZE = 50;

/**
 * 携带分页参数
 */
export type Paging<T extends object = object> = T & {
  page: number;
  pageSize: number;
};

export function withPaging<T extends object>(data: T, page = 1, pageSize = DEFAULT_PAGE_SIZE): Paging<T> {
  return { page, pageSize, ...data };
}

export interface ListResponse<T> {
  total: number;
  list: T[];
}

export type NestArr<T extends object = Record<string, any>> = T & {
  [key: string]: any;
  children: NestArr<T>[] | null;
};
