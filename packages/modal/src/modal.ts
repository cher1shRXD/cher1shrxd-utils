import { ReactNode } from "react";
import { useModalStore } from "./hooks/useModalStore";

export const modal = {
  open: (content: ReactNode): void => {
    useModalStore.getState().openModal(content);
  },
  close: (): void => {
    useModalStore.getState().closeModal();
  },
  closeAll: (): void => {
    useModalStore.getState().closeAllModal();
  },
};
