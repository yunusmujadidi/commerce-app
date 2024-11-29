import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
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

  return <>{children}</>;
}
