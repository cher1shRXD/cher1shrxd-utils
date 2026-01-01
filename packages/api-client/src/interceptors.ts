import type {
  HttpInstance,
  InternalRequestConfig,
  HttpResponse,
  HttpError,
} from "./types";

const isClient = typeof window !== "undefined";

export const createDefaultInterceptors = (debug: boolean = false) => {
  return (instance: HttpInstance): void => {
    instance.interceptors.request.use(
      (config: InternalRequestConfig) => {
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
      (error: HttpError) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response: HttpResponse) => {
        return response;
      },
      async (error: HttpError) => {
        if (debug) {
          console.error("[API Error]", error.response?.data);
        }
        return Promise.reject(error);
      }
    );
  };
};
