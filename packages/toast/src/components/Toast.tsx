"use client";

import { X } from "lucide-react";
import { CSSProperties, JSX } from "react";
import { ToastMessage, ToastWithClosing } from "../types";

interface Props {
  toast: ToastWithClosing;
  removeToast: (id: string) => void;
  getToastIcon: (type: ToastMessage["type"]) => JSX.Element;
}

const wrapperStyle: CSSProperties = {
  animation: "cher-slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
};

const wrapperClosingStyle: CSSProperties = {
  animation: "cher-slideOutRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
};

const toastStyle: CSSProperties = {
  minWidth: "320px",
  padding: "1rem 1.25rem",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "0.75rem",
  background: "#FDFDFD",
  border: "1px solid #DEDEDE",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
  transition: "all 0.2s ease-out",
  backdropFilter: "blur(10px)",
};

const iconStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const contentStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  flex: 1,
  minWidth: 0,
};

const titleStyle: CSSProperties = {
  color: "#121212",
  fontSize: "1rem",
  lineHeight: "1.3",
  letterSpacing: "-0.02em",
  fontWeight: 600,
};

const messageStyle: CSSProperties = {
  color: "#121212",
  fontSize: "0.875rem",
  lineHeight: "1.2",
  letterSpacing: "-0.02em",
  fontWeight: 400,
};

const closeButtonStyle: CSSProperties = {
  flexShrink: 0,
  color: "#B3B3B3",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.25rem",
  borderRadius: "6px",
  transition: "all 0.2s ease-out",
};

const Toast = ({ toast, removeToast, getToastIcon }: Props) => {
  return (
    <div
      style={toast.isClosing ? wrapperClosingStyle : wrapperStyle}
      onMouseEnter={(e) => {
        const target = e.currentTarget.querySelector('[data-toast]') as HTMLElement;
        if (target) {
          target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)";
          target.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget.querySelector('[data-toast]') as HTMLElement;
        if (target) {
          target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)";
          target.style.transform = "translateY(0)";
        }
      }}
    >
      <div style={toastStyle} data-toast>
        <div style={iconStyle}>{getToastIcon(toast.type)}</div>
        <div style={contentStyle}>
          <div style={titleStyle}>{toast.title}</div>
          <div style={messageStyle}>{toast.message}</div>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          style={closeButtonStyle}
          type="button"
          aria-label="Close toast"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
            e.currentTarget.style.color = "#121212";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#B3B3B3";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
