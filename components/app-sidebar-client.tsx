"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  GalleryVertical,
  LayoutDashboard,
  Library,
  Palette,
  Scaling,
  Settings,
  ShoppingBag,
  ShoppingCart,
  StoreIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StoreSwitcher } from "./store-switch";
import { Store } from "@prisma/client";

const items = [
  {
    title: "Overview",
    url: "/dashboard/${store.id}",
    icon: LayoutDashboard,
  },
  {
    title: "Billboards",
    url: "/dashboard/${store.id}/billboards",
    icon: GalleryVertical,
  },
  {
    title: "Categories",
    url: "/dashboard/${store.id}/categories",
    icon: Library,
  },
  {
    title: "Sizes",
    url: "/dashboard/${store.id}/sizes",
    icon: Scaling,
  },
  {
    title: "Colors",
    url: "/dashboard/${store.id}/colors",
    icon: Palette,
  },
  {
    title: "Products",
    url: "/dashboard/${store.id}/products",
    icon: ShoppingBag,
  },
  {
    title: "Orders",
    url: "/dashboard/${store.id}/orders",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    url: "/dashboard/${store.id}/settings",
    icon: Settings,
  },
];

export function AppSidebarClient({ stores = [] }: { stores: Store[] }) {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex mb-10 items-center justify-center ">
          <StoreIcon className="mr-2 size-4" />
          Commerce
        </div>
        <StoreSwitcher items={stores} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary text-black dark:text-white"
                        )}
                        href={``}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div>User Menu</div>
      </SidebarFooter>
    </Sidebar>
  );
}
