import { getStore } from "@/module/actions/store-action";
import { AppSidebarClient } from "./app-sidebar-client";

export async function AppSidebar() {
  const stores = await getStore();
  return <AppSidebarClient stores={stores.result || []} />;
}
