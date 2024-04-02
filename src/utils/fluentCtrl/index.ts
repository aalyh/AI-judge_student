/**
 * 防抖函数
 * @param fn 需要被防抖的函数
 * @param delay 延迟时间, 默认 400ms
 * @param immediate 是否立即执行, 默认为 false
 * @returns
 */
export function debounce(
  fn: (...args: any[]) => any,
  delay: number = 300,
  immediate: boolean = false,
) {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (!immediate) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    } else {
      !timer && fn.apply(this, args);
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    }
  };
}

/**
 * 节流函数
 * @param fn 需要被节流的函数
 * @param delay 节流阀时间, 默认2秒，建议至少超过1秒
 */
export function throttle(
  fn: (...args: any[]) => any,
  delay: number = 2 * 1000,
) {
  let timer: NodeJS.Timer | null = null;
  let isThrottled = false;
  return (...args: any[]) => {
    if (!isThrottled) {
      fn.apply(this, args);
      isThrottled = true;
      timer = setTimeout(() => {
        isThrottled = false;
        timer = null;
      }, delay);
    }
  };
}
