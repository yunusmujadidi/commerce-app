import { getStores } from "@/actions/store-action";
import { AppSidebarClient } from "./app-sidebar-client";
import { User } from "@prisma/client";
import { getSession } from "@/lib/get-session";

export async function AppSidebar() {
  const stores = await getStores();
  const session = await getSession();
  return (
    <AppSidebarClient
      user={session?.user as User}
      stores={stores.result || []}
    />
  );
}
