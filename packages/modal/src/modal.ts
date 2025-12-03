import { ReactNode } from "react";
import { useModalStore } from "./hooks/useModalStore";

/**
 * Modal API
 *
 * @example
 * import { modal } from "@cher1shrxd/modal";
 *
 * // Open modal with custom content
 * modal.open(<YourComponent />);
 *
 * // Close current modal
 * modal.close();
 *
 * // Close all modals
 * modal.closeAll();
 */
export const modal = {
  /**
   * Open modal with custom content
   * @param content - React component or element to display in modal
   */
  open: (content: ReactNode): void => {
    useModalStore.getState().openModal(content);
  },

  /**
   * Close the currently open modal (top-most if stacked)
   */
  close: (): void => {
    useModalStore.getState().closeModal();
  },

  /**
   * Close all open modals
   */
  closeAll: (): void => {
    useModalStore.getState().closeAllModal();
  },
};
