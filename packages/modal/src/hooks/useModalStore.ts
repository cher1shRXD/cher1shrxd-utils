"use client";

import { create } from "zustand";
import { ReactNode } from "react";

export interface ModalItem {
  id: string;
  content: ReactNode;
}

interface ModalState {
  isOpen: boolean;
  content: ReactNode | null;
  modals: ModalItem[];
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  closeAllModal: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false,
  content: null,
  modals: [],
  openModal: (content) => {
    const id = crypto.randomUUID();
    const newModals = [...get().modals, { id, content }];
    set({
      isOpen: true,
      content: newModals[newModals.length - 1].content,
      modals: newModals,
    });
  },
  closeModal: () => {
    const currentModals = get().modals;
    if (currentModals.length <= 1) {
      set({ isOpen: false, content: null, modals: [] });
    } else {
      const newModals = currentModals.slice(0, -1);
      set({
        isOpen: true,
        content: newModals[newModals.length - 1].content,
        modals: newModals,
      });
    }
  },
  closeAllModal: () => {
    set({ isOpen: false, content: null, modals: [] });
  },
}));
