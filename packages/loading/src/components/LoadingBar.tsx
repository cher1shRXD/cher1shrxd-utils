"use client";

import { CSSProperties } from "react";
import { useLoading } from "../hooks/useLoading";

interface LoadingBarProps {
  color?: string;
}

const containerStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "0.125rem",
  zIndex: 9999,
  pointerEvents: "none",
};

const LoadingBar = ({ color = "#3b82f6" }: LoadingBarProps) => {
  const { progress, visible } = useLoading();

  const barStyle: CSSProperties = {
    height: "100%",
    width: `${progress}%`,
    opacity: visible ? 1 : 0,
    background: color,
    boxShadow: visible ? `0 0 10px ${color}40` : "none",
    transitionProperty: "width",
    transitionTimingFunction: "ease-out",
    transitionDuration: progress === 100 ? "0.2s" : "0.3s",
    willChange: "width",
  };

  return (
    <div style={containerStyle}>
      <div style={barStyle} />
    </div>
  );
};

export default LoadingBar;
