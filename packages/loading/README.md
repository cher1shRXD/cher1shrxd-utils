# @cher1shrxd/loading

A smooth page transition loading bar for Next.js (App Router).

## Installation

```bash
pnpm add @cher1shrxd/loading zustand
```

## Setup

### 1. Add LoadingBar component

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

### 2. Use the router hook or Link component

**Option 1: Using the router hook**

```tsx
"use client";

import { useRouter } from "@cher1shrxd/loading";

export default function Navigation() {
  const router = useRouter();

  return (
    <nav>
      <button onClick={() => router.push("/about")}>About</button>
      <button onClick={() => router.push("/contact")}>Contact</button>
      <button onClick={() => router.back()}>Back</button>
    </nav>
  );
}
```

**Option 2: Using the Link component**

```tsx
import { Link } from "@cher1shrxd/loading";

export default function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/contact" className="nav-link">Contact</Link>
    </nav>
  );
}
```

## API

### LoadingBar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `"#3b82f6"` | Color of the loading bar |

### Link

A wrapper around Next.js `Link` that automatically triggers the loading bar.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `href` | `string` | Yes | Destination URL |
| `children` | `ReactNode` | Yes | Link content |
| `className` | `string` | No | CSS class name |
| `onClick` | `() => void` | No | Click handler |

```tsx
import { Link } from "@cher1shrxd/loading";

<Link href="/about" className="nav-link">
  About Us
</Link>
```

### useRouter

A wrapper around Next.js `useRouter` that automatically triggers the loading bar.

```typescript
const router = useRouter();

router.push("/path");    // Navigate with loading bar
router.replace("/path"); // Replace with loading bar
router.back();           // Go back with loading bar
router.refresh();        // Refresh (no loading bar)
```

### useLoadingStore

Direct access to the loading state (Zustand store).

```typescript
import { useLoadingStore } from "@cher1shrxd/loading";

const { isLoading, setIsLoading } = useLoadingStore();

// Manually trigger loading
setIsLoading(true);

// Stop loading
setIsLoading(false);
```

### useLoading

Access to progress and visibility state.

```typescript
import { useLoading } from "@cher1shrxd/loading";

const { progress, visible } = useLoading();
// progress: 0-100
// visible: boolean
```

## How it works

1. When you use `useRouter().push()` or click a `Link`, it sets `isLoading: true`
2. The loading bar starts animating (progress increases)
3. When the route changes (pathname changes), progress jumps to 100%
4. After animation completes, the bar fades out

## Peer Dependencies

- `next` >= 13.0.0
- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `zustand` >= 4.0.0

## License

MIT
