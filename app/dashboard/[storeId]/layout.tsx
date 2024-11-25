import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/app-sidebar";
import { Navigation } from "@/components/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  //TODO: add react cache to session auth
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
        <div className="flex-col w-full">
          <div className="flex-1 px-8 pt-6 space-y-4">
            <Navigation store={store} />
          </div>
          {children}
        </div>
      </SidebarProvider>
    </>
  );
}
