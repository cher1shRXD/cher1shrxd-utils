# @cher1shrxd/toast

A beautiful toast notification library for React/Next.js.

## Installation

```bash
pnpm add @cher1shrxd/toast lucide-react
```

## Setup

### 1. Add ToastContainer

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

## Usage

```tsx
import { toast } from "@cher1shrxd/toast";

// Show different types of toasts
toast.success("Success", "Operation completed successfully!");
toast.error("Error", "Something went wrong!");
toast.warning("Warning", "Please check your input.");
toast.info("Info", "Here's some information.");

// With custom duration (ms)
toast.success("Success", "This will close in 5 seconds", 5000);

// Generic show method
toast.show("Title", "Message", "success", 3000);
```

## API

### toast

| Method | Parameters | Description |
|--------|------------|-------------|
| `success` | `(title, message, duration?)` | Show success toast |
| `error` | `(title, message, duration?)` | Show error toast |
| `warning` | `(title, message, duration?)` | Show warning toast |
| `info` | `(title, message, duration?)` | Show info toast |
| `show` | `(title, message, type?, duration?)` | Show toast with custom type |

### Types

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

## Customization

You can override CSS variables to customize the appearance:

```css
:root {
  /* Override toast styles */
  .cher-toast-container {
    top: 20px;
    right: 20px;
  }
  
  .cher-toast {
    /* your custom styles */
  }
}
```

## Peer Dependencies

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `lucide-react` >= 0.300.0

## License

MIT
