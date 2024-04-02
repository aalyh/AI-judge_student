import { userInfoModel } from "@/types/user";
export interface tokenStorageType {
  token: string;
  expireTime: number;
}

export type userInfoType = tokenStorageType & userInfoModel;
