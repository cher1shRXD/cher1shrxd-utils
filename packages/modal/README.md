# @cher1shrxd/modal

A flexible modal/dialog library for React with stacking support.

## Features

- 🎯 **Imperative API** - Open modals from anywhere with `modal.open()`
- 📚 **Stacking support** - Multiple modals can be stacked
- ⌨️ **Keyboard support** - ESC to close
- 🎨 **Customizable** - Pass any React component as content
- 🔒 **Body scroll lock** - Automatically prevents background scrolling
- 🌐 **Portal-based** - Renders outside your app's DOM hierarchy

## Installation

```bash
pnpm add @cher1shrxd/modal zustand
```

## Setup

### 1. Add ModalProvider

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

## Usage

### Basic Usage

```tsx
import { modal } from "@cher1shrxd/modal";

// Open a modal
modal.open(
  <div>
    <h2>Hello!</h2>
    <p>This is a modal content.</p>
    <button onClick={() => modal.close()}>Close</button>
  </div>
);

// Close the current modal
modal.close();

// Close all modals
modal.closeAll();
```

### With Custom Component

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
        <button onClick={() => modal.close()}>Cancel</button>
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

// Usage
modal.open(
  <ConfirmModal
    title="Delete Item"
    message="Are you sure you want to delete this item?"
    onConfirm={() => deleteItem(id)}
  />
);
```

### Stacked Modals

```tsx
// First modal
modal.open(
  <div>
    <h2>First Modal</h2>
    <button onClick={() => {
      // Open second modal on top
      modal.open(
        <div>
          <h2>Second Modal</h2>
          <button onClick={() => modal.close()}>Close This</button>
          <button onClick={() => modal.closeAll()}>Close All</button>
        </div>
      );
    }}>
      Open Another Modal
    </button>
  </div>
);
```

### Using the Hook

```tsx
"use client";

import { useModalStore } from "@cher1shrxd/modal";

export const MyComponent = () => {
  const { isOpen, modals, openModal, closeModal, closeAllModal } = useModalStore();

  return (
    <div>
      <p>Open modals: {modals.length}</p>
      <button onClick={() => openModal(<div>Content</div>)}>
        Open Modal
      </button>
    </div>
  );
};
```

## API

### modal

| Method | Parameters | Description |
|--------|------------|-------------|
| `open` | `(content: ReactNode)` | Open a modal with the given content |
| `close` | `()` | Close the top-most modal |
| `closeAll` | `()` | Close all open modals |

### ModalProvider

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `baseZIndex` | `number` | `10000` | Base z-index for modals |

### useModalStore

Zustand store with direct access to modal state.

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

Hook that provides modal state and handles side effects (body scroll, ESC key, portal).

```typescript
const {
  isOpen,      // boolean
  content,     // ReactNode | null
  modals,      // ModalItem[]
  closeModal,  // () => void
  mountedRoot, // HTMLElement | null
} = useModal();
```

## Styling

### Custom Modal Styles

Override the default styles:

```css
/* Custom overlay */
.cher-modal-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}

/* Custom modal container */
.cher-modal {
  padding: 32px;
  border-radius: 16px;
  max-width: 500px;
}
```

### Close Button Helper

A `.cher-modal-close` class is available for styling close buttons:

```tsx
modal.open(
  <div style={{ position: "relative" }}>
    <button className="cher-modal-close" onClick={() => modal.close()}>
      ×
    </button>
    <h2>Modal Title</h2>
    <p>Content here...</p>
  </div>
);
```

## Behavior

- **Click outside** - Clicking the overlay closes the top-most modal
- **ESC key** - Pressing Escape closes the top-most modal  
- **Body scroll** - Body scrolling is disabled when a modal is open
- **Stacking** - Each new modal appears above the previous one

## Peer Dependencies

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `zustand` >= 4.0.0

## License

MIT
