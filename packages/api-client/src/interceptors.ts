import {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const isClient = typeof window !== "undefined";

export const createDefaultInterceptors = (debug: boolean = false) => {
  return (instance: AxiosInstance): void => {
    instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (debug) {
          const prefix = isClient ? "[Client]" : "[Server]";
          console.log(
            `${prefix} API Request:`,
            config.method?.toUpperCase(),
            config.url,
            {
              headers: config.headers,
              withCredentials: config.withCredentials,
            }
          );
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        if (debug) {
          console.error("[API Error]", error.response?.data);
        }
        return Promise.reject(error);
      }
    );
  };
};
