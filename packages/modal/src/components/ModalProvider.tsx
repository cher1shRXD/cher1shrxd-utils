"use client";

import { CSSProperties, useEffect } from "react";
import { createPortal } from "react-dom";
import { useModal } from "../hooks/useModal";

interface ModalProviderProps {
  /** Base z-index for modals (default: 10000) */
  baseZIndex?: number;
}

// Inject keyframes once
let keyframesInjected = false;

const injectKeyframes = () => {
  if (typeof document === 'undefined' || keyframesInjected) return;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cher-modal-fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes cher-modal-slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
  keyframesInjected = true;
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "cher-modal-fadeIn 0.3s ease-out",
};

const modalStyle: CSSProperties = {
  position: "relative",
  background: "#FDFDFD",
  borderRadius: "12px",
  padding: "1.5rem",
  maxWidth: "90vw",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  animation: "cher-modal-slideUp 0.3s ease-out",
};

const scrollbarStyles = `
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const ModalProvider = ({ baseZIndex = 10000 }: ModalProviderProps) => {
  const { modals, closeModal, mountedRoot } = useModal();

  useEffect(() => {
    injectKeyframes();
  }, []);

  if (modals.length === 0 || !mountedRoot) return null;

  return createPortal(
    <>
      <style>{scrollbarStyles}</style>
      {modals.map((modal, index) => (
        <div
          key={modal.id}
          style={{ ...overlayStyle, zIndex: baseZIndex + index }}
          onClick={index === modals.length - 1 ? closeModal : undefined}
        >
          <div
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            {modal.content}
          </div>
        </div>
      ))}
    </>,
    mountedRoot
  );
};

export default ModalProvider;
