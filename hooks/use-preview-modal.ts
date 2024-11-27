import { Products } from "@/lib/types";
import { create } from "zustand";

interface usePreviewModalProps {
  isOpen: boolean;
  onOpen: (data: Products) => void;
  onClose: () => void;
  data?: Products;
}

export const usePreviewModal = create<usePreviewModalProps>((set) => ({
  isOpen: false,
  onOpen: (data: Products) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
  data: undefined,
}));
