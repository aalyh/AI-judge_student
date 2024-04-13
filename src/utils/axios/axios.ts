import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from "axios";
import { HttpCodeConfig } from "./httpCode";
import {
  ResponseModel,
  UploadFileItemModel,
  UploadRequestConfig,
} from "./types/index";
import useUserStore from "@/stores/modules/userInfo";
import { showFailToast } from "vant";
import { getToken } from "@/utils/token";
let userStore: any;
let token: string | undefined;

class HttpRequest {
  service: AxiosInstance;

  constructor() {
    this.service = axios.create({
      baseURL: import.meta.env.VITE_APP_BASE_URL,
      timeout: 5 * 10000,
    });

    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        /**
         * set your config
         */
        if (!userStore) {
          userStore = useUserStore();
          console.log(getToken());
          token = getToken()?.token;
        }
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        console.log("requestError: ", error);
        return Promise.reject(error);
      },
      {
        synchronous: true, // Async ? default value is true, means
        runWhen: (config: InternalAxiosRequestConfig) => {
          // do something

          // if return true, axios will execution interceptor method
          return true;
        },
      }
    );

    this.service.interceptors.response.use(
      (response: AxiosResponse<ResponseModel>): AxiosResponse["data"] => {
        const { data } = response;
        const { code } = data;
        if (code) {
          if (code != HttpCodeConfig.success) {
            switch (code) {
              case HttpCodeConfig.error:
                showFailToast(data.message as string);
                break;
              case HttpCodeConfig.notFound:
                // the method to handle this code
                break;
              case HttpCodeConfig.noPermission:
                // the method to handle this code
                break;
              default:
                break;
            }
            return Promise.reject(data.message);
          } else {
            return data;
          }
        } else {
          return Promise.reject("Error! code missing!");
        }
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
  }

  request<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    /**
     * TODO: execute other methods according to config
     */
    return new Promise((resolve, reject) => {
      try {
        this.service
          .request<ResponseModel<T>>(config)
          .then((res: AxiosResponse["data"]) => {
            resolve(res as ResponseModel<T>);
          })
          .catch((err) => {
            // do something
            reject(err);
          });
      } catch (err) {
        return Promise.reject(err);
      }
    });
  }

  get<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: "GET", ...config });
  }
  post<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: "POST", ...config });
  }
  put<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: "PUT", ...config });
  }
  delete<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: "DELETE", ...config });
  }
  upload<T = string>(
    fileItem: UploadFileItemModel,
    config?: UploadRequestConfig
  ): Promise<ResponseModel<T>> | null {
    if (!import.meta.env.VITE_UPLOAD_URL) return null;

    const fd = new FormData();
    fd.append(fileItem.name, fileItem.value);
    let configCopy: UploadRequestConfig;
    if (!config) {
      configCopy = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    } else {
      config.headers!["Content-Type"] = "multipart/form-data";
      configCopy = config;
    }
    return this.request({
      url: import.meta.env.VITE_UPLOAD_URL,
      data: fd,
      ...configCopy,
    });
  }
}

const httpRequest = new HttpRequest();
export default httpRequest;
