# @cher1shrxd/toast

React/Next.js용 토스트 알림 라이브러리

## 설치

```bash
pnpm add @cher1shrxd/toast
```

## 설정

### ToastContainer 추가

```tsx
// app/layout.tsx (Next.js App Router)
import { ToastContainer } from "@cher1shrxd/toast";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
```

## 사용법

```tsx
import { toast } from "@cher1shrxd/toast";

// 타입별 토스트
toast.success("성공", "작업이 완료되었습니다!");
toast.error("오류", "문제가 발생했습니다!");
toast.warning("경고", "입력값을 확인해주세요.");
toast.info("안내", "참고해주세요.");

// 지속 시간 지정 (ms)
toast.success("성공", "5초 후 사라집니다", 5000);

// 일반 show 메서드
toast.show("제목", "메시지", "success", 3000);
```

## API

### toast

| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
| `success` | `(title, message, duration?)` | 성공 토스트 |
| `error` | `(title, message, duration?)` | 에러 토스트 |
| `warning` | `(title, message, duration?)` | 경고 토스트 |
| `info` | `(title, message, duration?)` | 정보 토스트 |
| `show` | `(title, message, type?, duration?)` | 타입 지정 토스트 |

### 타입

```typescript
type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
}
```

## 스타일 커스터마이징

CSS를 오버라이드해서 스타일을 변경할 수 있습니다:

```css
:root {
  .cher-toast-container {
    top: 20px;
    right: 20px;
  }

  .cher-toast {
    /* 커스텀 스타일 */
  }
}
```

## Peer Dependencies

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `lucide-react` >= 0.300.0

## License

MIT
