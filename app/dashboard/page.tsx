"use client";

import { Button } from "@/components/ui/button";
import { useStoreModal } from "@/module/hooks/use-store-modal";
import { signOut } from "next-auth/react";

const Dashboard = () => {
  const { onOpen } = useStoreModal();
  return (
    <>
      <Button onClick={() => signOut()}>SignPut</Button>
      <button onClick={onOpen}>dasghbsdoard</button>;
    </>
  );
};

export default Dashboard;
