import type { HttpInstance } from "./types";
import { ApiRequest, GetApiRequest } from "./api-request";
import { createHttpInstance } from "./http-instance";
import { ApiClientConfig, ApiRequestConfig, ServerCookieConfig } from "./types";

export interface ApiClient {
  get<T = never>(url: string, config?: ApiRequestConfig): GetApiRequest<T>;
  post<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T>;
  put<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T>;
  patch<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T>;
  delete<T = never>(url: string, config?: ApiRequestConfig): ApiRequest<T>;
  getHttpInstance(): HttpInstance;
}

export interface CreateApiClientOptions extends ApiClientConfig {
  serverCookieConfig?: ServerCookieConfig;
}

export const createApiClient = (options: CreateApiClientOptions): ApiClient => {
  const httpInstance = createHttpInstance(options);
  const serverCookieConfig = options.serverCookieConfig ?? null;

  return {
    get<T = never>(url: string, config?: ApiRequestConfig): GetApiRequest<T> {
      return new GetApiRequest<T>(url, "GET", config, httpInstance, serverCookieConfig);
    },

    post<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T> {
      return new ApiRequest<T>(url, "POST", { ...config, data }, httpInstance, serverCookieConfig);
    },

    put<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T> {
      return new ApiRequest<T>(url, "PUT", { ...config, data }, httpInstance, serverCookieConfig);
    },

    patch<T = never>(url: string, data?: unknown, config?: ApiRequestConfig): ApiRequest<T> {
      return new ApiRequest<T>(url, "PATCH", { ...config, data }, httpInstance, serverCookieConfig);
    },

    delete<T = never>(url: string, config?: ApiRequestConfig): ApiRequest<T> {
      return new ApiRequest<T>(url, "DELETE", config, httpInstance, serverCookieConfig);
    },

    getHttpInstance(): HttpInstance {
      return httpInstance;
    },
  };
};
