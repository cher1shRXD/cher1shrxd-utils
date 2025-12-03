import axios, { AxiosInstance } from "axios";
import { ApiClientConfig } from "./types";
import { createDefaultInterceptors } from "./interceptors";

export const createAxiosInstance = (config: ApiClientConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout ?? 10000,
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
    withCredentials: config.withCredentials ?? true,
  });

  // Apply custom interceptors if provided, otherwise use default
  if (config.setupInterceptors) {
    config.setupInterceptors(instance);
  } else {
    createDefaultInterceptors(config.debug)(instance);
  }

  // Apply additional interceptor callbacks if provided
  if (config.interceptors) {
    const { onRequest, onRequestError, onResponse, onResponseError } = config.interceptors;

    if (onRequest || onRequestError) {
      instance.interceptors.request.use(
        onRequest ?? ((config) => config),
        onRequestError ?? ((error) => Promise.reject(error))
      );
    }

    if (onResponse || onResponseError) {
      instance.interceptors.response.use(
        onResponse ?? ((response) => response),
        onResponseError ?? ((error) => Promise.reject(error))
      );
    }
  }

  return instance;
};
