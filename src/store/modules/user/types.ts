export interface PermissionType {
  [key: string]: any;
  desc?: string;
  id?: { [key: string]: any };
  key: string;
  name: string;
  parentId: { [key: string]: any };
  url: string;
}
export interface UserState {
  username: string;
  avatar: string;
  nickname: string;
  email: string;
  auth: string[];
  permissions: string[];
  removeRouteFns: any[];
}
