interface UrlQueryObjType {
  [key: string]: number | string | boolean;
}
/**
 * 传入一个对象, 以key1=value1&key2=value2形式将其拼接为url的query字符串返回
 * @param urlQueryObj 一个url query参数对象
 * @returns 拼接好的query字符串
 */
export function queryFomart(urlQueryObj: UrlQueryObjType) {
  return Object.keys(urlQueryObj)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(urlQueryObj[key]) /* eslint-disable-line */)
    .join('&');
}

export function todo() {}
