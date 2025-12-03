"use client";

import { useEffect, useState } from "react";
import { useModalStore } from "./useModalStore";

export const useModal = () => {
  const { isOpen, content, modals, closeModal } = useModalStore();
  const [mountedRoot, setMountedRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let modalRoot = document.getElementById("cher-modal-root");
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "cher-modal-root";
      document.body.appendChild(modalRoot);
    }
    setTimeout(() => {
      setMountedRoot(modalRoot);
    }, 0);

    return () => {
      if (modalRoot && modalRoot.childNodes.length === 0) {
        modalRoot.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modals.length]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modals.length > 0) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [modals.length, closeModal]);

  return {
    isOpen,
    content,
    modals,
    closeModal,
    mountedRoot,
  };
};
