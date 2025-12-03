"use client";

import { useEffect, useState, useCallback } from "react";
import { ToastMessage, ToastWithClosing } from "../types";
import { toastEventEmitter } from "../toast";

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastWithClosing[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isClosing: true } : toast
      )
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  useEffect(() => {
    const handleToast = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, { ...toast, isClosing: false }]);

      setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration || 3000);
    };

    toastEventEmitter.on("showToast", handleToast);

    return () => {
      toastEventEmitter.off("showToast");
    };
  }, [removeToast]);

  return { toasts, removeToast };
};
