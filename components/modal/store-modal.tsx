import { StoreForm } from "../form/store-form";
import { Modal } from "../modal";
import { useStoreModal } from "@/module/hooks/use-store-modal";

export const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <StoreForm />
    </Modal>
  );
};
