"use client";
import { useStoreModal } from "@/module/hooks/use-store-modal";
import { useEffect } from "react";
import { toast } from "sonner";

const DashboardPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      toast.error("Create your first store to continue!");
      onOpen();
    }
  }, [onOpen, isOpen]);
};

export default DashboardPage;
