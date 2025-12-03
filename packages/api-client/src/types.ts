import {
  AxiosRequestConfig,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

export interface ApiRequestConfig extends Omit<AxiosRequestConfig, "method" | "url"> {
  withCredentials?: boolean;
  _useServerCookies?: boolean;
}

export type ApiError<T> = AxiosError<T>;

export interface InterceptorCallbacks {
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  onRequestError?: (error: AxiosError) => Promise<never>;
  onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onResponseError?: (error: AxiosError) => Promise<never>;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  setupInterceptors?: (instance: AxiosInstance) => void;
  interceptors?: InterceptorCallbacks;
  debug?: boolean;
}

export interface ServerCookieConfig {
  cookieNames: string[];
  redirectPath: string | null;
}
