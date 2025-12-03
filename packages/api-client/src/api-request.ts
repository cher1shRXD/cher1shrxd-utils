import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiRequestConfig, ServerCookieConfig } from "./types";

const isClient = typeof window !== "undefined";

export class ApiRequest<T = never> {
  private url: string;
  private method: string;
  private config: ApiRequestConfig;
  private axiosInstance: AxiosInstance;
  private serverCookieConfig: ServerCookieConfig | null;

  constructor(
    url: string,
    method: string,
    config: ApiRequestConfig = {},
    axiosInstance: AxiosInstance,
    serverCookieConfig: ServerCookieConfig | null = null
  ) {
    this.url = url;
    this.method = method;
    this.config = config;
    this.axiosInstance = axiosInstance;
    this.serverCookieConfig = serverCookieConfig;
  }

  withCookie(): ApiRequest<T> {
    if (isClient) {
      return new ApiRequest<T>(
        this.url,
        this.method,
        {
          ...this.config,
          withCredentials: true,
        },
        this.axiosInstance,
        this.serverCookieConfig
      );
    } else {
      return new ApiRequest<T>(
        this.url,
        this.method,
        {
          ...this.config,
          _useServerCookies: true,
        },
        this.axiosInstance,
        this.serverCookieConfig
      );
    }
  }

  async execute(): Promise<AxiosResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      method: this.method as AxiosRequestConfig["method"],
      url: this.url,
      ...this.config,
    };

    if (!isClient && this.config._useServerCookies) {
      const nextHeaders = await import("next/headers");
      const cookies = nextHeaders.cookies;
      const cookieStore = await cookies();

      if (this.serverCookieConfig) {
        const { cookieNames, redirectPath } = this.serverCookieConfig;
        const hasAuthCookie = cookieNames.some((name) => cookieStore.get(name));

        if (!hasAuthCookie && redirectPath) {
          const nextNavigation = await import("next/navigation");
          nextNavigation.redirect(redirectPath);
        }
      }

      const cookieString = cookieStore.toString();

      if (cookieString) {
        requestConfig.headers = {
          ...requestConfig.headers,
          Cookie: cookieString,
        };
      }
    }

    return this.axiosInstance.request<T>(requestConfig);
  }

  then<TResult1 = AxiosResponse<T>, TResult2 = never>(
    onfulfilled?: ((value: AxiosResponse<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ): Promise<AxiosResponse<T> | TResult> {
    return this.execute().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<AxiosResponse<T>> {
    return this.execute().finally(onfinally);
  }
}
