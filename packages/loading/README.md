# @cher1shrxd/loading

Next.js App Router용 페이지 전환 로딩바

## 설치

```bash
pnpm add @cher1shrxd/loading zustand
```

## 설정

### LoadingBar 추가

```tsx
// app/layout.tsx
import { LoadingBar } from "@cher1shrxd/loading";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LoadingBar color="#3b82f6" />
        {children}
      </body>
    </html>
  );
}
```

### 라우터 훅 또는 Link 컴포넌트 사용

**방법 1: useRouter 훅**

```tsx
"use client";

import { useRouter } from "@cher1shrxd/loading";

export default function Navigation() {
  const router = useRouter();

  return (
    <nav>
      <button onClick={() => router.push("/about")}>소개</button>
      <button onClick={() => router.push("/contact")}>연락처</button>
      <button onClick={() => router.back()}>뒤로가기</button>
    </nav>
  );
}
```

**방법 2: Link 컴포넌트**

```tsx
import { Link } from "@cher1shrxd/loading";

export default function Navigation() {
  return (
    <nav>
      <Link href="/about">소개</Link>
      <Link href="/contact" className="nav-link">연락처</Link>
    </nav>
  );
}
```

## API

### LoadingBar

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `color` | `string` | `"#3b82f6"` | 로딩바 색상 |

### Link

Next.js `Link`를 감싸서 로딩바를 자동으로 표시합니다.

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `href` | `string` | O | 이동할 URL |
| `children` | `ReactNode` | O | 링크 내용 |
| `className` | `string` | X | CSS 클래스 |
| `onClick` | `() => void` | X | 클릭 핸들러 |

```tsx
import { Link } from "@cher1shrxd/loading";

<Link href="/about" className="nav-link">
  소개
</Link>
```

### useRouter

Next.js `useRouter`를 감싸서 로딩바를 자동으로 표시합니다.

```typescript
const router = useRouter();

router.push("/path");    // 로딩바와 함께 이동
router.replace("/path"); // 로딩바와 함께 교체
router.back();           // 로딩바와 함께 뒤로가기
router.refresh();        // 새로고침 (로딩바 없음)
```

### useLoadingStore

Zustand 스토어로 로딩 상태에 직접 접근합니다.

```typescript
import { useLoadingStore } from "@cher1shrxd/loading";

const { isLoading, setIsLoading } = useLoadingStore();

// 수동으로 로딩 시작
setIsLoading(true);

// 로딩 종료
setIsLoading(false);
```

### useLoading

진행률과 표시 상태에 접근합니다.

```typescript
import { useLoading } from "@cher1shrxd/loading";

const { progress, visible } = useLoading();
// progress: 0-100
// visible: boolean
```

## 동작 방식

1. `useRouter().push()` 또는 `Link` 클릭시 `isLoading: true` 설정
2. 로딩바 애니메이션 시작 (progress 증가)
3. 라우트 변경 완료시 (pathname 변경) progress가 100%로 이동
4. 애니메이션 완료 후 로딩바 페이드아웃

## Peer Dependencies

- `next` >= 13.0.0
- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `zustand` >= 4.0.0

## License

MIT
