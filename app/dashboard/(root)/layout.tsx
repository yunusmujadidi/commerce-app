import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { prisma } from "@/lib/prisma";
import { ModalProviders } from "@/module/providers/modal-provider";
import { redirect } from "next/navigation";
export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }

  const store = await prisma.store.findFirst({
    where: {
      userId: session.user?.id,
    },
  });

  if (store) {
    redirect(`/dashboard/${store.id}`);
  }

  return (
    <>
      <Toaster />
      <ModalProviders />
      {children}
    </>
  );
}
