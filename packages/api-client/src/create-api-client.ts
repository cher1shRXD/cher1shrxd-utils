import { AxiosInstance } from "axios";
import { ApiRequest } from "./api-request";
import { createAxiosInstance } from "./axios-instance";
import { ApiClientConfig, ApiRequestConfig, ServerCookieConfig } from "./types";

export interface ApiClient {
  get<T = never>(url: string, config?: ApiRequestConfig): ApiRequest<T>;
  post<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T>;
  put<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T>;
  patch<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T>;
  delete<T = never>(url: string, config?: ApiRequestConfig): ApiRequest<T>;
  getAxiosInstance(): AxiosInstance;
}

export interface CreateApiClientOptions extends ApiClientConfig {
  serverCookieConfig?: ServerCookieConfig;
}

export const createApiClient = (options: CreateApiClientOptions): ApiClient => {
  const axiosInstance = createAxiosInstance(options);
  const serverCookieConfig = options.serverCookieConfig ?? null;

  return {
    get<T = never>(url: string, config?: ApiRequestConfig): ApiRequest<T> {
      return new ApiRequest<T>(url, "GET", config, axiosInstance, serverCookieConfig);
    },

    post<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T> {
      return new ApiRequest<T>(url, "POST", { ...config, data }, axiosInstance, serverCookieConfig);
    },

    put<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T> {
      return new ApiRequest<T>(url, "PUT", { ...config, data }, axiosInstance, serverCookieConfig);
    },

    patch<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T> {
      return new ApiRequest<T>(url, "PATCH", { ...config, data }, axiosInstance, serverCookieConfig);
    },

    delete<T = never>(url: string, config?: ApiRequestConfig): ApiRequest<T> {
      return new ApiRequest<T>(url, "DELETE", config, axiosInstance, serverCookieConfig);
    },

    getAxiosInstance(): AxiosInstance {
      return axiosInstance;
    },
  };
};
