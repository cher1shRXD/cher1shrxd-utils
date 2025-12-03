# @cher1shrxd/api-client

Next.js SSR 환경에서 쿠키 전달을 지원하는 API 클라이언트

## 설치

```bash
pnpm add @cher1shrxd/api-client axios
```

## 설정

### 기본 설정

```typescript
// lib/api.ts
import { createApiClient } from "@cher1shrxd/api-client";

export const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
});
```

### 전체 설정

```typescript
// lib/api.ts
import { createApiClient } from "@cher1shrxd/api-client";

export const apiClient = createApiClient({
  // 필수
  baseURL: process.env.NEXT_PUBLIC_API_URL!,

  // 선택
  timeout: 10000,
  headers: {
    "X-Custom-Header": "value",
  },
  withCredentials: true,
  debug: process.env.NODE_ENV === "development",

  // 서버사이드 쿠키 설정
  // cookieNames에 등록된 쿠키가 실제로 저장되어 있지 않다면 redirectPath로 페이지 이동
  serverCookieConfig: {
    cookieNames: ["SESSION", "SESSION-LOCAL"],
    redirectPath: "/login", // null로 설정시 리다이렉트 비활성화
  },

  // 인터셉터 콜백
  interceptors: {
    onRequest: (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    onResponseError: (error) => {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  },

  // 또는 setupInterceptors로 직접 제어 (기본 인터셉터 대체)
  // setupInterceptors: (instance) => {
  //   instance.interceptors.request.use(...);
  // },
});
```

## 사용법

### 기본 요청

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

### 쿠키 전달 (서버 컴포넌트)

```typescript
// Server Component 또는 API Route에서
const profile = await apiClient
  .get<Profile>("/profile")
  .withCookie();

// 요청 헤더에 쿠키가 자동으로 포함됨
```

### 요청 설정

```typescript
const response = await apiClient.get<Data>("/data", {
  params: { page: 1, limit: 10 },
  headers: { "X-Request-ID": "123" },
});
```

### 타입 지정

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// 응답 타입: AxiosResponse<User[]>
const response = await apiClient.get<User[]>("/users");

// data 타입: User[]
const users = response.data;
```

### 에러 처리

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

### Axios 인스턴스 접근

```typescript
const axiosInstance = apiClient.getAxiosInstance();

// 생성 후 커스텀 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 처리
    }
    return Promise.reject(error);
  }
);
```

## 인터셉터

### 콜백 방식 (권장)

`interceptors` 옵션으로 인터셉터를 추가합니다. 기본 인터셉터 이후에 실행됩니다.

```typescript
const apiClient = createApiClient({
  baseURL: "https://api.example.com",
  interceptors: {
    // 요청 전 설정 수정
    onRequest: (config) => {
      config.headers.Authorization = `Bearer ${getToken()}`;
      return config;
    },

    // 요청 에러 처리
    onRequestError: (error) => {
      console.error("Request failed:", error);
      return Promise.reject(error);
    },

    // 응답 변환
    onResponse: (response) => {
      console.log("Response:", response.status);
      return response;
    },

    // 응답 에러 처리 (401, 500 등)
    onResponseError: async (error) => {
      if (error.response?.status === 401) {
        await refreshToken();
        return apiClient.getAxiosInstance().request(error.config!);
      }
      return Promise.reject(error);
    },
  },
});
```

### setupInterceptors 방식 (직접 제어)

`setupInterceptors`를 사용하면 기본 인터셉터를 완전히 대체합니다.

```typescript
const apiClient = createApiClient({
  baseURL: "https://api.example.com",
  setupInterceptors: (instance) => {
    instance.interceptors.request.use(
      (config) => {
        // 직접 구현
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

> `setupInterceptors` 사용시 기본 디버그 로깅 인터셉터가 적용되지 않습니다.

## API

### createApiClient(options)

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `baseURL` | `string` | **필수** | 요청 기본 URL |
| `timeout` | `number` | `10000` | 요청 타임아웃 (ms) |
| `headers` | `Record<string, string>` | `{}` | 기본 헤더 |
| `withCredentials` | `boolean` | `true` | 자격 증명 포함 여부 |
| `debug` | `boolean` | `false` | 콘솔 로깅 활성화 |
| `serverCookieConfig` | `ServerCookieConfig` | `undefined` | 서버 쿠키 설정 |
| `interceptors` | `InterceptorCallbacks` | `undefined` | 인터셉터 콜백 |
| `setupInterceptors` | `(instance) => void` | `undefined` | 커스텀 인터셉터 (기본값 대체) |

### InterceptorCallbacks

| 옵션 | 타입 | 설명 |
|------|------|------|
| `onRequest` | `(config) => config` | 요청 설정 수정 |
| `onRequestError` | `(error) => Promise.reject(error)` | 요청 에러 처리 |
| `onResponse` | `(response) => response` | 응답 수정 |
| `onResponseError` | `(error) => Promise.reject(error)` | 응답 에러 처리 |

### ServerCookieConfig

| 옵션 | 타입 | 설명 |
|------|------|------|
| `cookieNames` | `string[]` | 인증 확인할 쿠키 이름 목록 |
| `redirectPath` | `string \| null` | 인증 없을 때 리다이렉트 경로 (null시 비활성화) |

### ApiClient 메서드

| 메서드 | 시그니처 |
|--------|----------|
| `get` | `<T>(url, config?) => ApiRequest<T>` |
| `post` | `<T>(url, data?, config?) => ApiRequest<T>` |
| `put` | `<T>(url, data?, config?) => ApiRequest<T>` |
| `patch` | `<T>(url, data?, config?) => ApiRequest<T>` |
| `delete` | `<T>(url, config?) => ApiRequest<T>` |
| `getAxiosInstance` | `() => AxiosInstance` |

### ApiRequest 메서드

| 메서드 | 설명 |
|--------|------|
| `.withCookie()` | 쿠키 전달 활성화 |
| `.execute()` | 요청 실행 (Promise 반환) |
| `.then()` | Promise then 핸들러 |
| `.catch()` | Promise catch 핸들러 |
| `.finally()` | Promise finally 핸들러 |

## Peer Dependencies

- `axios` >= 1.0.0
- `next` >= 13.0.0

## License

MIT
