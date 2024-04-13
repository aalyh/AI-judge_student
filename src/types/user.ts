import { tagModel } from "./tag";
export interface RegisterFormType {
  // 指定所有索引的类型为string
  // [key: string]: string;
  username: string;
  password: string;
  // rePassword: string;
  // mail: string;
  // code: string;
}

export interface LoginParamsModel {
  username: string;
  password: string;
}

export interface LoginModel {
  token: string;
}

export interface userInfoModel {
  [key: string]: string | null | number | tagModel[];
  id: string | number;
  username: string;
  nickname: string;
  avatar: string;
  school: string | null;
  introduce: string | null;
  tagVOList: tagModel[];
}
