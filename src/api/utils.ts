/**
 * Share utilities for API
 */

/**
 * 默认每页数量
 */
const DEFAULT_PAGE_SIZE = 50;

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

/**
 * 若值为undefined，则整个键都会被忽略
 * @params acceptNullString 是否忽略空字符串值
 */
export function createFormData(data: Record<string, string | Blob | undefined>, acceptNullString = false) {
  const fd = new FormData();
  Object.entries(data).forEach(([name, value]) => {
    if (value || (acceptNullString && typeof value === 'string')) {
      fd.append(name, value);
    }
  });
  return fd;
}
