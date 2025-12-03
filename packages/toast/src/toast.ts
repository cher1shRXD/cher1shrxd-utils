import { ToastMessage } from "./types";

type ToastCallback = (toast: ToastMessage) => void;

class ToastEventEmitter {
  private listeners: Map<string, ToastCallback> = new Map();

  on(event: string, callback: ToastCallback): void {
    this.listeners.set(event, callback);
  }

  off(event: string): void {
    this.listeners.delete(event);
  }

  emit(event: string, data: ToastMessage): void {
    const callback = this.listeners.get(event);
    if (callback) callback(data);
  }
}

export const toastEventEmitter = new ToastEventEmitter();

export const toast = {
  show(
    title: string,
    message: string,
    type: ToastMessage["type"] = "info",
    duration = 3000
  ): void {
    toastEventEmitter.emit("showToast", {
      id: Date.now().toString(),
      title,
      message,
      type,
      duration,
    });
  },

  success(title: string, message: string, duration?: number): void {
    this.show(title, message, "success", duration);
  },

  error(title: string, message: string, duration?: number): void {
    this.show(title, message, "error", duration);
  },

  warning(title: string, message: string, duration?: number): void {
    this.show(title, message, "warning", duration);
  },

  info(title: string, message: string, duration?: number): void {
    this.show(title, message, "info", duration);
  },
};
