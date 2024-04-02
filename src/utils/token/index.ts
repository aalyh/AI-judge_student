import { encrypt, decrypt } from "../crypt";
import { tokenStorageType } from "@/stores/modules/types/user";
import useUserStore from "@/stores/modules/userInfo/index";
let userStore: any;
const token_key = import.meta.env.VITE_APP_TOKEN_KEY || "liushi_token";
const effectiveTime = 1000 * 60 * 60 * 24 * 7; // token有效时间 一周

const getToken = (): tokenStorageType | null | undefined => {
  if (!userStore) userStore = useUserStore();
  if (userStore.token) {
    return {
      token: userStore.token,
      expireTime: userStore.expireTime,
    };
  }
  const tokenJSON: string | null | undefined = localStorage.getItem(token_key);
  if (!tokenJSON) return;

  const tokenObj = decrypt(tokenJSON, true);
  if (tokenObj) {
    const { token } = tokenObj as tokenStorageType;
    if (token == null || typeof token == "undefined") return;
    return tokenObj;
  } else {
    return;
  }
};

const removeToken = (): void => {
  localStorage.removeItem(token_key);
};

const setToken = (token: string): number => {
  const expireTime = new Date().getTime() + effectiveTime;
  removeToken();
  const tokenObj: tokenStorageType | string = Object.create(null, {
    token: {
      value: token,
      writable: false,
      configurable: false,
      enumerable: true,
    },
    expireTime: {
      value: expireTime,
      writable: false,
      configurable: false,
      enumerable: true,
    },
  });
  try {
    const secret = encrypt(tokenObj, true);
    localStorage.setItem(token_key, secret as string);
    userStore.setTokenCache({
      token: (tokenObj as tokenStorageType).token,
      expireTime: (tokenObj as tokenStorageType).expireTime,
    });
  } catch (e) {
    console.error(e);
  }
  return (tokenObj as tokenStorageType).expireTime;
};

const checkToken = (): boolean => {
  let flag = false;
  // store里没有自然就是未登录状态了
  if (!userStore) userStore = useUserStore();
  if (userStore.token) {
    flag = userStore.isTokenEffective();
  }
  return flag;
};

export { getToken, setToken, removeToken, checkToken };
