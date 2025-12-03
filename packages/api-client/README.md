# @cher1shrxd/api-client

A flexible, type-safe API client for Next.js with server-side cookie support.

## Features

- 🔒 **Server-side cookie forwarding** - Seamlessly pass cookies in SSR
- 🔗 **Builder pattern** - Fluent API with `.withCookie()` chain
- ⚡ **Thenable** - Use with `await` or `.then()`
- 🎯 **TypeScript first** - Full type inference
- 🔧 **Configurable** - Custom interceptors, headers, and more

## Installation

```bash
pnpm add @cher1shrxd/api-client axios
```

## Setup

### Basic Setup

```typescript
// lib/api.ts
import { createApiClient } from "@cher1shrxd/api-client";

export const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
});
```

### Full Configuration

```typescript
// lib/api.ts
import { createApiClient } from "@cher1shrxd/api-client";

export const apiClient = createApiClient({
  // Required
  baseURL: process.env.NEXT_PUBLIC_API_URL!,

  // Optional
  timeout: 10000,
  headers: {
    "X-Custom-Header": "value",
  },
  withCredentials: true,
  debug: process.env.NODE_ENV === "development",

  // Server-side cookie config
  serverCookieConfig: {
    cookieNames: ["SESSION", "SESSION-LOCAL"],
    redirectPath: "/login", // or null to disable
  },

  // Interceptor callbacks (recommended)
  interceptors: {
    onRequest: (config) => {
      // Add auth token
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    onResponseError: (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  },

  // OR: Full control with setupInterceptors (replaces default interceptors)
  // setupInterceptors: (instance) => {
  //   instance.interceptors.request.use(...);
  // },
});
```

## Usage

### Basic Requests

```typescript
import { apiClient } from "@/lib/api";

// GET
const users = await apiClient.get<User[]>("/users");
console.log(users.data);

// POST
const newUser = await apiClient.post<User>("/users", {
  name: "John",
  email: "john@example.com",
});

// PUT
await apiClient.put("/users/1", { name: "Updated" });

// PATCH
await apiClient.patch("/users/1", { name: "Patched" });

// DELETE
await apiClient.delete("/users/1");
```

### With Cookies (Server-Side)

```typescript
// In Server Component or API Route
const profile = await apiClient
  .get<Profile>("/profile")
  .withCookie();

// Cookies are automatically forwarded from the request
```

### With Request Config

```typescript
const response = await apiClient.get<Data>("/data", {
  params: { page: 1, limit: 10 },
  headers: { "X-Request-ID": "123" },
});
```

### Type Safety

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Response is typed as AxiosResponse<User[]>
const response = await apiClient.get<User[]>("/users");

// data is User[]
const users = response.data;
```

### Error Handling

```typescript
try {
  const response = await apiClient.get<User>("/users/999");
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.status); // 404
    console.error(error.response?.data);
  }
}
```

### Access Axios Instance

```typescript
const axiosInstance = apiClient.getAxiosInstance();

// Add custom interceptors after creation
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
```

## Interceptors

### Using Callbacks (Recommended)

Add interceptors via the `interceptors` option. These run **after** the default interceptors.

```typescript
const apiClient = createApiClient({
  baseURL: "https://api.example.com",
  interceptors: {
    // Modify request before sending
    onRequest: (config) => {
      config.headers.Authorization = `Bearer ${getToken()}`;
      return config;
    },

    // Handle request errors
    onRequestError: (error) => {
      console.error("Request failed:", error);
      return Promise.reject(error);
    },

    // Transform response
    onResponse: (response) => {
      // Log all responses
      console.log("Response:", response.status);
      return response;
    },

    // Handle response errors (e.g., 401, 500)
    onResponseError: async (error) => {
      if (error.response?.status === 401) {
        // Refresh token and retry
        await refreshToken();
        return apiClient.getAxiosInstance().request(error.config!);
      }
      return Promise.reject(error);
    },
  },
});
```

### Using setupInterceptors (Full Control)

Use `setupInterceptors` to completely replace the default interceptors.

```typescript
const apiClient = createApiClient({
  baseURL: "https://api.example.com",
  setupInterceptors: (instance) => {
    // You handle everything
    instance.interceptors.request.use(
      (config) => {
        // Your logic
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  },
});
```

> ⚠️ When using `setupInterceptors`, the default debug logging interceptors are **not** applied.

## API Reference

### createApiClient(options)

Creates an API client instance.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseURL` | `string` | **required** | Base URL for requests |
| `timeout` | `number` | `10000` | Request timeout (ms) |
| `headers` | `Record<string, string>` | `{}` | Default headers |
| `withCredentials` | `boolean` | `true` | Include credentials |
| `debug` | `boolean` | `false` | Enable console logging |
| `serverCookieConfig` | `ServerCookieConfig` | `undefined` | Server cookie settings |
| `interceptors` | `InterceptorCallbacks` | `undefined` | Interceptor callbacks |
| `setupInterceptors` | `(instance) => void` | `undefined` | Custom interceptors (replaces default) |

### InterceptorCallbacks

| Option | Type | Description |
|--------|------|-------------|
| `onRequest` | `(config) => config` | Modify request config |
| `onRequestError` | `(error) => Promise.reject(error)` | Handle request errors |
| `onResponse` | `(response) => response` | Modify response |
| `onResponseError` | `(error) => Promise.reject(error)` | Handle response errors |

### ServerCookieConfig

| Option | Type | Description |
|--------|------|-------------|
| `cookieNames` | `string[]` | Cookie names to check for auth |
| `redirectPath` | `string \| null` | Redirect path when no auth (null to disable) |

### ApiClient Methods

| Method | Signature |
|--------|-----------|
| `get` | `<T>(url, config?) => ApiRequest<T>` |
| `post` | `<T>(url, data?, config?) => ApiRequest<T>` |
| `put` | `<T>(url, data?, config?) => ApiRequest<T>` |
| `patch` | `<T>(url, data?, config?) => ApiRequest<T>` |
| `delete` | `<T>(url, config?) => ApiRequest<T>` |
| `getAxiosInstance` | `() => AxiosInstance` |

### ApiRequest Methods

| Method | Description |
|--------|-------------|
| `.withCookie()` | Enable cookie forwarding |
| `.execute()` | Execute request (returns Promise) |
| `.then()` | Promise then handler |
| `.catch()` | Promise catch handler |
| `.finally()` | Promise finally handler |

## Peer Dependencies

- `axios` >= 1.0.0
- `next` >= 13.0.0

## License

MIT
