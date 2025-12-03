"use client";

import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import { CSSProperties, useEffect } from "react";
import { ToastMessage } from "../types";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

let keyframesInjected = false;

const injectKeyframes = () => {
  if (typeof document === 'undefined' || keyframesInjected) return;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cher-slideInRight {
      from {
        opacity: 0;
        transform: translateX(120%) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }
    @keyframes cher-slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateX(120%) scale(0.9);
      }
    }
  `;
  document.head.appendChild(style);
  keyframesInjected = true;
};

const containerStyle: CSSProperties = {
  position: "fixed",
  top: "1.5rem",
  right: "1.5rem",
  zIndex: 10001,
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  maxWidth: "400px",
  fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    injectKeyframes();
  }, []);

  const getToastIcon = (type: ToastMessage["type"]) => {
    switch (type) {
      case "success":
        return <CircleCheck size={32} color="#10b981" />;
      case "error":
        return <CircleX size={32} color="#ef4444" />;
      case "warning":
        return <CircleAlert size={32} color="#f59e0b" />;
      case "info":
      default:
        return <Info size={32} color="#3b82f6" />;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const container = document.querySelector('[data-toast-container]') as HTMLElement;
      if (!container) return;

      if (window.innerWidth <= 640) {
        container.style.left = "1rem";
        container.style.right = "1rem";
        container.style.maxWidth = "none";
        
        const toasts = container.querySelectorAll('[data-toast]');
        toasts.forEach((toast) => {
          (toast as HTMLElement).style.minWidth = "auto";
          (toast as HTMLElement).style.width = "100%";
        });
      } else {
        container.style.left = "";
        container.style.right = "1.5rem";
        container.style.maxWidth = "400px";
        
        const toasts = container.querySelectorAll('[data-toast]');
        toasts.forEach((toast) => {
          (toast as HTMLElement).style.minWidth = "320px";
          (toast as HTMLElement).style.width = "";
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [toasts]);

  return (
    <div style={containerStyle} data-toast-container>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          removeToast={removeToast}
          getToastIcon={getToastIcon}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
