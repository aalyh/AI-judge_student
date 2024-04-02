/**
 *  验证邮箱格式
 */
// export const mailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
export const mailReg =
  /^[a-zA-Z0-9_.-]+@qq+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
/**
 * 验证中文
 */
export const cn_Reg = /[^\x00-\xff]/g;
