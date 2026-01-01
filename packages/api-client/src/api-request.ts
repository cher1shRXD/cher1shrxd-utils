import type { HttpInstance, RequestConfig, HttpResponse } from "./types";
import { ApiRequestConfig, ServerCookieConfig } from "./types";

const isClient = typeof window !== "undefined";

export class ApiRequest<T = never> {
  protected url: string;
  protected method: string;
  protected config: ApiRequestConfig;
  protected httpInstance: HttpInstance;
  protected serverCookieConfig: ServerCookieConfig | null;

  constructor(
    url: string,
    method: string,
    config: ApiRequestConfig = {},
    httpInstance: HttpInstance,
    serverCookieConfig: ServerCookieConfig | null = null
  ) {
    this.url = url;
    this.method = method;
    this.config = config;
    this.httpInstance = httpInstance;
    this.serverCookieConfig = serverCookieConfig;
  }

  protected clone(nextConfig: ApiRequestConfig): this {
    const Ctor = this.constructor as unknown as new (
      url: string,
      method: string,
      config: ApiRequestConfig,
      httpInstance: HttpInstance,
      serverCookieConfig: ServerCookieConfig | null
    ) => this;

    return new Ctor(this.url, this.method, nextConfig, this.httpInstance, this.serverCookieConfig);
  }

  withCookie(): ApiRequest<T> {
    if (isClient) {
      return this.clone({
        ...this.config,
        withCredentials: true,
      });
    }

    return this.clone({
      ...this.config,
      _useServerCookies: true,
    });
  }

  async execute(): Promise<HttpResponse<T>> {
    const isServer = !isClient;
    const isGet = this.method.toUpperCase() === "GET";

    const finalConfig: ApiRequestConfig = { ...this.config };

    if (isServer && isGet) {
      const hasExplicitRenderingConfig =
        finalConfig.cache !== undefined || finalConfig.next !== undefined;

      if (finalConfig._useServerCookies) {
        // Cookies make the request dynamic; force SSR.
        finalConfig.cache = "no-store";
        delete (finalConfig as any).next;
      } else if (!hasExplicitRenderingConfig) {
        // Default GET is SSR unless explicitly overridden via withISR/withSSG.
        finalConfig.cache = "no-store";
      }
    }

    const requestConfig: RequestConfig = {
      method: this.method as RequestConfig["method"],
      url: this.url,
      ...finalConfig,
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

    return this.httpInstance.request<T>(requestConfig);
  }

  then<TResult1 = HttpResponse<T>, TResult2 = never>(
    onfulfilled?: ((value: HttpResponse<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ): Promise<HttpResponse<T> | TResult> {
    return this.execute().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<HttpResponse<T>> {
    return this.execute().finally(onfinally);
  }
}

export class GetApiRequest<T = never> extends ApiRequest<T> {
  withISR(revalidateTime: number): this {
    if (!Number.isFinite(revalidateTime) || revalidateTime < 0) {
      throw new Error("revalidateTime must be a non-negative finite number");
    }

    return this.clone({
      ...this.config,
      cache: "force-cache",
      next: {
        ...(this.config.next ?? {}),
        revalidate: revalidateTime,
      },
    });
  }

  withSSG(): this {
    const next = this.config.next ? { ...this.config.next } : undefined;
    if (next) {
      delete next.revalidate;
      if (Object.keys(next).length === 0) {
        return this.clone({
          ...this.config,
          cache: "force-cache",
        });
      }
    }

    const nextConfig: ApiRequestConfig = {
      ...this.config,
      cache: "force-cache",
    };
    if (next) nextConfig.next = next;
    return this.clone(nextConfig);
  }
}
