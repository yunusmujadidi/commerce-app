"use client";

import { PreviewModal } from "@/components/modal/preview-modal";
import { StoreModal } from "@/components/modal/store-modal";

export const ModalClient = () => {
  return (
    <>
      <StoreModal />
      <PreviewModal />
    </>
  );
};
