import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";

import { AppSidebar } from "@/components/app-sidebar";
interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const storeId = (await params).storeId;

  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      userId: session.user.id,
    },
  });

  if (!store) {
    redirect("/dashboard");
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        {children}
      </SidebarProvider>
    </>
  );
}
