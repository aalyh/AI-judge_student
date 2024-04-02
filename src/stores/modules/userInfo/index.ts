import { defineStore } from "pinia";
import { removeToken, setToken } from "@/utils/token";
import { userInfoType, tokenStorageType } from "../types/user";
import { getInfoAPI, logoutAPI } from "@/api/user";
import { showSuccessToast } from "vant";

const useUserStore = defineStore("useUserStore", {
  state: (): userInfoType => {
    return {
      token: "",
      expireTime: 0,
      id: "",
      username: "",
      nickname: "",
      avatar: "",
      tagVOList: [],
      introduce: "",
      school: "",
    };
  },
  actions: {
    login(token: string, expire?: number) {
      const expireTime = expire ? expire : setToken(token);
      this.setTokenCache({ token, expireTime });
      return new Promise((resolve, reject) => {
        getInfoAPI()
          .then(
            ({ data }) => {
              const { info } = data;
              Object.keys(info).forEach((key) => {
                this[key] = info[key];
              });
            },
            (err) => {
              reject();
            },
          )
          .then(() => {
            showSuccessToast("登录成功, 正在跳转");
            resolve(true);
          });
      });
    },
    setTokenCache({ token, expireTime }: tokenStorageType) {
      this.token = token;
      this.expireTime = expireTime;
    },
    isTokenEffective() {
      const now: number = new Date().getTime();
      return now < this.expireTime;
    },
    logout() {
      return new Promise((resolve, reject) => {
        logoutAPI()
          .then(() => {
            removeToken();
            resolve(true);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});

export default useUserStore;
