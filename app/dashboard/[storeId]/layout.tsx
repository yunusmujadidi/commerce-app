import { redirect } from "next/navigation";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/app-sidebar";
import { Navigation } from "@/components/navigation";
import { getSession } from "@/lib/get-session";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const session = await getSession();

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
        <SidebarTrigger className="absolute md:hidden" />
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
