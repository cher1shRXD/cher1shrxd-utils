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

export interface InterceptorCallbacks {
  /** Called before request is sent. Return modified config. */
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  /** Called when request error occurs */
  onRequestError?: (error: AxiosError) => Promise<never>;
  /** Called when response is received. Return modified response. */
  onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  /** Called when response error occurs. Can retry or transform error. */
  onResponseError?: (error: AxiosError) => Promise<never>;
}

export interface ApiClientConfig {
  /** Base URL for all requests */
  baseURL: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Default headers for all requests */
  headers?: Record<string, string>;
  /** Enable credentials by default (default: true) */
  withCredentials?: boolean;
  /** Custom interceptors setup function (replaces default interceptors) */
  setupInterceptors?: (instance: AxiosInstance) => void;
  /** Interceptor callbacks (added after default interceptors) */
  interceptors?: InterceptorCallbacks;
  /** Enable debug logging (default: false) */
  debug?: boolean;
}

export interface ServerCookieConfig {
  /** Cookie names to check for authentication */
  cookieNames: string[];
  /** Redirect path when no auth cookie found (set to null to disable redirect) */
  redirectPath: string | null;
}
