export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export interface ToastWithClosing extends ToastMessage {
  isClosing?: boolean;
}
