import type {
  HttpError,
  HttpInstance,
  InternalRequestConfig,
  RequestConfig,
  HttpResponse,
} from "./types";
import { ApiClientConfig } from "./types";
import { createDefaultInterceptors } from "./interceptors";

type FulfilledFn<T> = ((value: T) => T | Promise<T>) | null | undefined;
type RejectedFn = ((error: any) => any) | null | undefined;

class HandlerManager<T> {
  private handlers: Array<{ fulfilled: FulfilledFn<T>; rejected: RejectedFn } | null> = [];

  use(fulfilled?: FulfilledFn<T>, rejected?: RejectedFn): number {
    this.handlers.push({ fulfilled, rejected });
    return this.handlers.length - 1;
  }

  eject(id: number): void {
    if (this.handlers[id]) this.handlers[id] = null;
  }

  getAll(): Array<{ fulfilled: FulfilledFn<T>; rejected: RejectedFn }> {
    return this.handlers.filter(Boolean) as Array<{ fulfilled: FulfilledFn<T>; rejected: RejectedFn }>;
  }
}

const normalizeHeaders = (headers?: any): Record<string, string> => {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }
  if (Array.isArray(headers)) {
    return headers.reduce<Record<string, string>>((acc, [k, v]) => {
      if (k) acc[String(k)] = String(v);
      return acc;
    }, {});
  }
  if (typeof headers === "object") {
    const obj: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers)) {
      if (v === undefined || v === null) continue;
      obj[String(k)] = String(v);
    }
    return obj;
  }
  return {};
};

const mergeAbortSignals = (signals: Array<AbortSignal | undefined>): AbortSignal | undefined => {
  const active = signals.filter(Boolean) as AbortSignal[];
  if (active.length === 0) return undefined;
  if (active.length === 1) return active[0];

  const controller = new AbortController();
  const abort = () => controller.abort();
  for (const s of active) {
    if (s.aborted) {
      controller.abort();
      break;
    }
    s.addEventListener("abort", abort, { once: true });
  }
  return controller.signal;
};

const buildURL = (baseURL: string | undefined, url: string): string => {
  if (!baseURL) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const trimmedBase = baseURL.replace(/\/+$/, "");
  const trimmedUrl = url.replace(/^\/+/, "");
  return `${trimmedBase}/${trimmedUrl}`;
};

const appendParams = (url: string, params: any, paramsSerializer?: any): string => {
  if (!params) return url;

  const serialized =
    typeof paramsSerializer === "function"
      ? paramsSerializer(params)
      : typeof paramsSerializer?.serialize === "function"
        ? paramsSerializer.serialize(params)
        : (() => {
            if (typeof params === "string") return params;
            if (params instanceof URLSearchParams) return params.toString();
            const usp = new URLSearchParams();
            for (const [k, v] of Object.entries(params)) {
              if (v === undefined || v === null) continue;
              if (Array.isArray(v)) {
                for (const item of v) usp.append(k, String(item));
              } else {
                usp.append(k, String(v));
              }
            }
            return usp.toString();
          })();

  if (!serialized) return url;
  const hasQuery = url.includes("?");
  return url + (hasQuery ? "&" : "?") + serialized;
};

const responseHeadersToObject = (headers: Headers): Record<string, string> => {
  const obj: Record<string, string> = {};
  headers.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};

const readResponseData = async (res: globalThis.Response, responseType?: any): Promise<any> => {
  if (responseType === "arraybuffer") return await res.arrayBuffer();
  if (responseType === "blob") return await res.blob();
  if (responseType === "stream") return res.body;
  if (responseType === "text" || responseType === "document") return await res.text();

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json") || contentType.includes("+json");
  if (responseType === "json" || isJson || responseType === undefined) {
    const text = await res.text();
    if (!text) return text;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return await res.text();
};

const createHttpError = (args: {
  message: string;
  code?: string;
  config: RequestConfig;
  request?: any;
  response?: HttpResponse;
  cause?: unknown;
}): HttpError => {
  const error = new Error(args.message) as any;
  error.isHttpError = true;
  error.code = args.code;
  error.config = args.config;
  error.request = args.request;
  error.response = args.response;
  error.cause = args.cause;
  error.toJSON = () => ({
    message: error.message,
    name: error.name,
    code: error.code,
    status: error.response?.status,
  });
  return error as HttpError;
};

class FetchHttpInstance {
  defaults: any;
  interceptors: {
    request: HandlerManager<InternalRequestConfig>;
    response: HandlerManager<HttpResponse>;
  };

  constructor(defaults: any) {
    this.defaults = defaults;
    this.interceptors = {
      request: new HandlerManager<InternalRequestConfig>(),
      response: new HandlerManager<HttpResponse>(),
    };
  }

  private async dispatchRequest<T>(config: RequestConfig): Promise<HttpResponse<T>> {
    const mergedHeaders = {
      ...normalizeHeaders(this.defaults?.headers),
      ...normalizeHeaders(config.headers),
    };

    const baseURL = config.baseURL ?? this.defaults?.baseURL;
    const timeout = config.timeout ?? this.defaults?.timeout;
    const withCredentials = config.withCredentials ?? this.defaults?.withCredentials;

    let finalUrl = buildURL(baseURL, config.url ?? "");
    finalUrl = appendParams(finalUrl, (config as any).params, (config as any).paramsSerializer);

    const method = (config.method ?? "GET").toString().toUpperCase();
    const isBodyAllowed = method !== "GET" && method !== "HEAD";

    let body: any = undefined;
    if (isBodyAllowed && (config as any).data !== undefined) {
      const data = (config as any).data;
      const contentTypeKey = Object.keys(mergedHeaders).find((k) => k.toLowerCase() === "content-type");
      const contentTypeValue = contentTypeKey ? mergedHeaders[contentTypeKey] : undefined;

      const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
      if (isFormData) {
        body = data;
        if (contentTypeKey) delete mergedHeaders[contentTypeKey];
      } else if (
        contentTypeValue?.includes("application/json") &&
        typeof data === "object" &&
        data !== null &&
        !(data instanceof ArrayBuffer)
      ) {
        body = JSON.stringify(data);
      } else {
        body = data;
      }
    }

    const controller = new AbortController();
    const timeoutId =
      typeof timeout === "number" && timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

    const signal = mergeAbortSignals([controller.signal, (config as any).signal]);

    const credentials = withCredentials ? "include" : "same-origin";

    try {
      const res = await fetch(finalUrl, {
        method,
        headers: mergedHeaders,
        body,
        signal,
        credentials,
      });

      const response: HttpResponse<T> = {
        data: (await readResponseData(res, (config as any).responseType)) as T,
        status: res.status,
        statusText: res.statusText,
        headers: responseHeadersToObject(res.headers),
        config: config as any,
        request: { url: finalUrl, method, headers: mergedHeaders },
      };

      const validateStatus =
        (config as any).validateStatus ?? ((status: number) => status >= 200 && status < 300);

      if (!validateStatus(response.status)) {
        throw createHttpError({
          message: `Request failed with status code ${response.status}`,
          code: "ERR_BAD_RESPONSE",
          config,
          request: response.request,
          response,
        });
      }

      return response;
    } catch (err: any) {
      if (err?.name === "AbortError") {
        throw createHttpError({
          message: "timeout of " + String(timeout ?? "") + "ms exceeded",
          code: "ECONNABORTED",
          config,
          cause: err,
        });
      }
      if (err?.isHttpError) throw err;
      throw createHttpError({
        message: err?.message ?? "Network Error",
        code: "ERR_NETWORK",
        config,
        cause: err,
      });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async request<T = any, R = HttpResponse<T>>(config: RequestConfig): Promise<R> {
    const initialConfig: any = {
      ...this.defaults,
      ...config,
      headers: {
        ...normalizeHeaders(this.defaults?.headers),
        ...normalizeHeaders(config.headers),
      },
      method: (config.method ?? "GET").toString().toLowerCase(),
    };

    let chain: Promise<any> = Promise.resolve(initialConfig as InternalRequestConfig);

    for (const h of this.interceptors.request.getAll()) {
      chain = chain.then(h.fulfilled ?? ((v: any) => v), h.rejected ?? ((e: any) => Promise.reject(e)));
    }

    chain = chain.then((cfg: any) => this.dispatchRequest<T>(cfg));

    for (const h of this.interceptors.response.getAll()) {
      chain = chain.then(h.fulfilled ?? ((v: any) => v), h.rejected ?? ((e: any) => Promise.reject(e)));
    }

    return chain as Promise<R>;
  }

  get<T = any, R = HttpResponse<T>>(url: string, config?: RequestConfig): Promise<R> {
    return this.request<T, R>({ ...(config ?? {}), method: "get", url });
  }

  delete<T = any, R = HttpResponse<T>>(url: string, config?: RequestConfig): Promise<R> {
    return this.request<T, R>({ ...(config ?? {}), method: "delete", url });
  }

  head<T = any, R = HttpResponse<T>>(url: string, config?: RequestConfig): Promise<R> {
    return this.request<T, R>({ ...(config ?? {}), method: "head", url });
  }

  options<T = any, R = HttpResponse<T>>(url: string, config?: RequestConfig): Promise<R> {
    return this.request<T, R>({ ...(config ?? {}), method: "options", url });
  }

  post<T = any, R = HttpResponse<T>>(url: string, data?: any, config?: RequestConfig): Promise<R> {
    return this.request<T, R>({ ...(config ?? {}), method: "post", url, data });
  }

  put<T = any, R = HttpResponse<T>>(url: string, data?: any, config?: RequestConfig): Promise<R> {
    return this.request<T, R>({ ...(config ?? {}), method: "put", url, data });
  }

  patch<T = any, R = HttpResponse<T>>(url: string, data?: any, config?: RequestConfig): Promise<R> {
    return this.request<T, R>({ ...(config ?? {}), method: "patch", url, data });
  }

  getUri(config?: RequestConfig): string {
    const url = config?.url ?? "";
    const baseURL = config?.baseURL ?? this.defaults?.baseURL;
    const full = buildURL(baseURL, url);
    return appendParams(full, (config as any)?.params, (config as any)?.paramsSerializer);
  }
}

export const createHttpInstance = (config: ApiClientConfig): HttpInstance => {
  const instance = new FetchHttpInstance({
    baseURL: config.baseURL,
    timeout: config.timeout ?? 10000,
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
    withCredentials: config.withCredentials ?? true,
  }) as unknown as HttpInstance;

  if (config.setupInterceptors) {
    config.setupInterceptors(instance);
  } else {
    createDefaultInterceptors(config.debug)(instance);
  }

  if (config.interceptors) {
    const { onRequest, onRequestError, onResponse, onResponseError } = config.interceptors;

    if (onRequest || onRequestError) {
      (instance as any).interceptors.request.use(
        onRequest ?? ((cfg: any) => cfg),
        onRequestError ?? ((error: any) => Promise.reject(error))
      );
    }

    if (onResponse || onResponseError) {
      (instance as any).interceptors.response.use(
        onResponse ?? ((response: any) => response),
        onResponseError ?? ((error: any) => Promise.reject(error))
      );
    }
  }

  return instance;
};
