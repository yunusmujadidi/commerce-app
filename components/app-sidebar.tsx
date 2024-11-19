import { getStore } from "@/module/actions/store-action";
import { AppSidebarClient } from "./app-sidebar-client";
import { auth } from "@/auth";
import { User } from "@prisma/client";

export async function AppSidebar() {
  const stores = await getStore();
  const session = await auth();
  return (
    <AppSidebarClient
      user={session?.user as User}
      stores={stores.result || []}
    />
  );
}
