# @cher1shrxd/utils

A collection of reusable utilities for Next.js projects.

## Packages

| Package | Description | Install |
|---------|-------------|---------|
| [@cher1shrxd/toast](./packages/toast) | Toast notifications | `pnpm add @cher1shrxd/toast` |
| [@cher1shrxd/loading](./packages/loading) | Page transition loading bar | `pnpm add @cher1shrxd/loading` |
| [@cher1shrxd/modal](./packages/modal) | Flexible modal/dialog | `pnpm add @cher1shrxd/modal` |
| [@cher1shrxd/api-client](./packages/api-client) | Flexible API client | `pnpm add @cher1shrxd/api-client` |

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build specific package
pnpm --filter @cher1shrxd/toast build
```

### Project Structure

```
cher1shrxd-utils/
├── packages/
│   ├── toast/           # Toast notifications
│   ├── loading/         # Loading bar
│   ├── modal/           # Modal/dialog
│   └── api-client/      # API client
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Publishing

### Setup Changesets

```bash
pnpm changeset init
```

### Create a Changeset

```bash
pnpm changeset
```

### Publish

```bash
pnpm release
```

## Quick Start

### Toast

```tsx
import { ToastContainer, toast } from "@cher1shrxd/toast";
import "@cher1shrxd/toast/styles.css";

// In layout
<ToastContainer />

// Anywhere
toast.success("Success!", "Operation completed");
```

### Loading

```tsx
import { LoadingBar, useCustomRouter } from "@cher1shrxd/loading";
import "@cher1shrxd/loading/styles.css";

// In layout
<LoadingBar color="#3b82f6" />

// In components
const router = useCustomRouter();
router.push("/about");
```

### Modal

```tsx
import { ModalProvider, modal } from "@cher1shrxd/modal";
import "@cher1shrxd/modal/styles.css";

// In layout
<ModalProvider />

// Anywhere
modal.open(<MyModalContent />);
modal.close();
```

### API Client

```tsx
import { createApiClient } from "@cher1shrxd/api-client";

const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
});

const users = await api.get<User[]>("/users");
```

## License

MIT
