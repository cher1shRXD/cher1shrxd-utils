# @cher1shrxd/utils

Next.js 프로젝트를 위한 유틸리티 모음

## 패키지

| 패키지 | 설명 | 설치 |
|--------|------|------|
| [@cher1shrxd/toast](./packages/toast) | 토스트 알림 | `pnpm add @cher1shrxd/toast` |
| [@cher1shrxd/loading](./packages/loading) | 페이지 전환 로딩바 | `pnpm add @cher1shrxd/loading` |
| [@cher1shrxd/modal](./packages/modal) | 모달 (다중 모달 지원) | `pnpm add @cher1shrxd/modal` |
| [@cher1shrxd/api-client](./packages/api-client) | SSR 쿠키 지원 API 클라이언트 | `pnpm add @cher1shrxd/api-client` |

## 빠른 시작

### Toast

```tsx
import { ToastContainer, toast } from "@cher1shrxd/toast";

// layout.tsx에 추가
<ToastContainer />

// 어디서든 사용
toast.success("성공", "작업이 완료되었습니다");
toast.error("오류", "문제가 발생했습니다");
```

### Loading

```tsx
import { LoadingBar, useRouter, Link } from "@cher1shrxd/loading";

// layout.tsx에 추가
<LoadingBar color="#3b82f6" />

// 컴포넌트에서 사용
const router = useRouter();
router.push("/about");

// 또는 Link 컴포넌트 사용
<Link href="/about">소개</Link>
```

### Modal

```tsx
import { ModalProvider, modal } from "@cher1shrxd/modal";

// layout.tsx에 추가
<ModalProvider />

// 어디서든 사용
modal.open(<MyModalContent />);
modal.close();
modal.closeAll();
```

### API Client

```tsx
import { createApiClient } from "@cher1shrxd/api-client";

const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
});

// 기본 요청
const users = await api.get<User[]>("/users");

// 서버 컴포넌트에서 쿠키 전달
const profile = await api.get<Profile>("/profile").withCookie();
```

## 개발

```bash
# 의존성 설치
pnpm install

# 전체 빌드
pnpm build

# 특정 패키지 빌드
pnpm --filter @cher1shrxd/toast build
```

## 프로젝트 구조

```
cher1shrxd-utils/
├── packages/
│   ├── toast/        # 토스트 알림
│   ├── loading/      # 로딩바
│   ├── modal/        # 모달
│   └── api-client/   # API 클라이언트
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## 배포

```bash
# 빌드 후 배포
pnpm build && pnpm -r publish
```

## License

MIT
