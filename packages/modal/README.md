# @cher1shrxd/modal

React/Next.js용 모달 라이브러리 (다중 모달 지원)

## 설치

```bash
pnpm add @cher1shrxd/modal zustand
```

## 설정

### ModalProvider 추가

```tsx
// app/layout.tsx
import { ModalProvider } from "@cher1shrxd/modal";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ModalProvider />
      </body>
    </html>
  );
}
```

## 사용법

### 기본 사용

```tsx
import { modal } from "@cher1shrxd/modal";

// 모달 열기
modal.open(
  <div>
    <h2>안녕하세요!</h2>
    <p>모달 내용입니다.</p>
    <button onClick={() => modal.close()}>닫기</button>
  </div>
);

// 현재 모달 닫기
modal.close();

// 모든 모달 닫기
modal.closeAll();
```

### 커스텀 컴포넌트

```tsx
// components/ConfirmModal.tsx
import { modal } from "@cher1shrxd/modal";

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
}

export const ConfirmModal = ({ title, message, onConfirm }: Props) => {
  const handleConfirm = () => {
    onConfirm();
    modal.close();
  };

  return (
    <div style={{ minWidth: 300 }}>
      <h2>{title}</h2>
      <p>{message}</p>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={() => modal.close()}>취소</button>
        <button onClick={handleConfirm}>확인</button>
      </div>
    </div>
  );
};

// 사용
modal.open(
  <ConfirmModal
    title="항목 삭제"
    message="정말 삭제하시겠습니까?"
    onConfirm={() => deleteItem(id)}
  />
);
```

### 모달 중첩

```tsx
// 첫 번째 모달
modal.open(
  <div>
    <h2>첫 번째 모달</h2>
    <button onClick={() => {
      // 두 번째 모달 열기
      modal.open(
        <div>
          <h2>두 번째 모달</h2>
          <button onClick={() => modal.close()}>이것만 닫기</button>
          <button onClick={() => modal.closeAll()}>모두 닫기</button>
        </div>
      );
    }}>
      다른 모달 열기
    </button>
  </div>
);
```

### Hook 사용

```tsx
"use client";

import { useModalStore } from "@cher1shrxd/modal";

export const MyComponent = () => {
  const { isOpen, modals, openModal, closeModal, closeAllModal } = useModalStore();

  return (
    <div>
      <p>열린 모달 수: {modals.length}</p>
      <button onClick={() => openModal(<div>내용</div>)}>
        모달 열기
      </button>
    </div>
  );
};
```

## API

### modal

| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
| `open` | `(content: ReactNode)` | 모달 열기 |
| `close` | `()` | 현재 모달 닫기 |
| `closeAll` | `()` | 모든 모달 닫기 |

### ModalProvider

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `baseZIndex` | `number` | `10000` | 모달 기본 z-index |

### useModalStore

Zustand 스토어로 모달 상태에 직접 접근합니다.

```typescript
interface ModalState {
  isOpen: boolean;
  content: ReactNode | null;
  modals: ModalItem[];
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  closeAllModal: () => void;
}
```

### useModal

모달 상태와 사이드 이펙트(body scroll, ESC 키, portal)를 처리하는 훅입니다.

```typescript
const {
  isOpen,      // boolean
  content,     // ReactNode | null
  modals,      // ModalItem[]
  closeModal,  // () => void
  mountedRoot, // HTMLElement | null
} = useModal();
```

## 스타일 커스터마이징

```css
/* 오버레이 커스텀 */
.cher-modal-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}

/* 모달 컨테이너 커스텀 */
.cher-modal {
  padding: 32px;
  border-radius: 16px;
  max-width: 500px;
}
```

### 닫기 버튼 스타일

`.cher-modal-close` 클래스로 닫기 버튼 스타일을 지정할 수 있습니다:

```tsx
modal.open(
  <div style={{ position: "relative" }}>
    <button className="cher-modal-close" onClick={() => modal.close()}>
      ×
    </button>
    <h2>모달 제목</h2>
    <p>내용...</p>
  </div>
);
```

## 동작 방식

- **바깥 클릭** - 오버레이 클릭시 최상위 모달 닫힘
- **ESC 키** - ESC 누르면 최상위 모달 닫힘
- **스크롤 잠금** - 모달 열리면 body 스크롤 비활성화
- **중첩** - 새 모달은 이전 모달 위에 표시

## Peer Dependencies

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `zustand` >= 4.0.0

## License

MIT
