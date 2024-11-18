// app/dashboard/(dashboard)/[storeId]/layout.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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

  return <div>{children}</div>;
}
