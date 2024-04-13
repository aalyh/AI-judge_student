import request from "@/utils/axios/axios";
import type {
  RegisterFormType,
  LoginModel,
  LoginParamsModel,
  // userInfoModel,
} from "../types/user";
const schema = "user";
const enum userAPI {
  logout = `${schema}/front/logout`,
  register = `${schema}/register`,
  login = `${schema}/login`,
  getInfo = `${schema}/info`,
}

/**
 * 用户注册
 * @param data 注册信息
 * @returns
 */
export async function registerAPI(data: RegisterFormType) {
  return await request.post({
    url: userAPI.register,
    data,
  });
}

/**
 * 用户登录
 * @param data
 * @returns
 */
export async function loginAPI(data: LoginParamsModel) {
  return await request.post<LoginModel>({
    url: userAPI.login,
    data,
  });
}

/**
 * 退出登录
 * @returns
 */
export async function logoutAPI() {
  return await request.post({
    url: userAPI.logout,
  });
}

/**
 * 发送验证码
 * @param mail 邮箱
 * @returns 验证码
 */
// export async function sendCodeAPI(mail: string) {
//   return await request.get({
//     url: userAPI.code + `/${mail}`,
//   });
// }

/**
 * 未登录状态下修改密码
 * @param data
 * @returns
 */
// export async function retrievePwdAPI(data: RegisterFormType) {
//   return await request.post({
//     url: userAPI.retrievePwd + `/${data.mail}`,
//     data,
//   });
// }

/**
 * 根据token获取用户信息
 * @returns
 */
export function getInfoAPI() {
  return request.post({
    url: userAPI.getInfo,
  });
}
