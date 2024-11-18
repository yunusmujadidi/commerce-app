"use client";

import { useMountedState } from "react-use";

import { StoreModal } from "@/components/modal/store-modal";

export const ModalProviders = () => {
  const isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <StoreModal />
    </>
  );
};
