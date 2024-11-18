import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { ModalProviders } from "@/module/providers/modal-provider";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <>
      <Toaster />
      <ModalProviders />
      {children}
    </>
  );
}
