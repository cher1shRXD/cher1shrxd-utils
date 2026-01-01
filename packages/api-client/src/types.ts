export interface RequestConfig<D = any> {
  url?: string;
  method?: string;
  baseURL?: string;
  headers?: any;
  params?: any;
  paramsSerializer?:
    | ((params: any) => string)
    | {
        serialize: (params: any) => string;
      };
  data?: D;
  timeout?: number;
  withCredentials?: boolean;
  responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream"
    | string;
  validateStatus?: (status: number) => boolean;
  signal?: AbortSignal;
  [key: string]: any;
}

export interface InternalRequestConfig<D = any> extends RequestConfig<D> {
  headers: any;
}

export interface HttpResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: RequestConfig<D>;
  request?: any;
}

export interface HttpError<T = any, D = any> extends Error {
  config?: RequestConfig<D>;
  code?: string;
  request?: any;
  response?: HttpResponse<T, D>;
  isHttpError: boolean;
  toJSON: () => object;
  cause?: unknown;
}

export interface InterceptorManager<V> {
  use(
    onFulfilled?: ((value: V) => V | Promise<V>) | null,
    onRejected?: ((error: any) => any) | null
  ): number;
  eject(id: number): void;
}

export interface HttpInstance {
  defaults: any;
  interceptors: {
    request: InterceptorManager<InternalRequestConfig>;
    response: InterceptorManager<HttpResponse>;
  };

  request<T = any, R = HttpResponse<T>, D = any>(config: RequestConfig<D>): Promise<R>;
  get<T = any, R = HttpResponse<T>, D = any>(url: string, config?: RequestConfig<D>): Promise<R>;
  delete<T = any, R = HttpResponse<T>, D = any>(url: string, config?: RequestConfig<D>): Promise<R>;
  head<T = any, R = HttpResponse<T>, D = any>(url: string, config?: RequestConfig<D>): Promise<R>;
  options<T = any, R = HttpResponse<T>, D = any>(url: string, config?: RequestConfig<D>): Promise<R>;
  post<T = any, R = HttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: RequestConfig<D>
  ): Promise<R>;
  put<T = any, R = HttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: RequestConfig<D>
  ): Promise<R>;
  patch<T = any, R = HttpResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: RequestConfig<D>
  ): Promise<R>;
  getUri(config?: RequestConfig): string;

  [key: string]: any;
}

export const isHttpError = (payload: unknown): payload is HttpError => {
  return typeof payload === "object" && payload !== null && (payload as any).isHttpError === true;
};

export interface ApiRequestConfig extends Omit<RequestConfig, "method" | "url"> {
  withCredentials?: boolean;
  _useServerCookies?: boolean;
  /** Next.js fetch cache control (App Router). */
  cache?: FetchCache;
  /** Next.js fetch options (App Router). */
  next?: NextFetchConfig;
}

export type FetchCache =
  | "default"
  | "no-store"
  | "reload"
  | "no-cache"
  | "force-cache"
  | "only-if-cached";

export interface NextFetchConfig {
  revalidate?: number | false;
  tags?: string[];
}

export type ApiError<T> = HttpError<T>;

export interface InterceptorCallbacks {
  onRequest?: (config: InternalRequestConfig) => InternalRequestConfig | Promise<InternalRequestConfig>;
  onRequestError?: (error: HttpError) => Promise<never>;
  onResponse?: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>;
  onResponseError?: (error: HttpError) => Promise<never>;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  setupInterceptors?: (instance: HttpInstance) => void;
  interceptors?: InterceptorCallbacks;
  debug?: boolean;
}

export interface ServerCookieConfig {
  cookieNames: string[];
  redirectPath: string | null;
}
