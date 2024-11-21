import { getStores } from "@/actions/store-action";
import { AppSidebarClient } from "./app-sidebar-client";
import { auth } from "@/auth";
import { User } from "@prisma/client";

export async function AppSidebar() {
  const stores = await getStores();
  const session = await auth();
  return (
    <AppSidebarClient
      user={session?.user as User}
      stores={stores.result || []}
    />
  );
}
