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
import { useParams, usePathname } from "next/navigation";
import { StoreSwitcher } from "./store-switch";
import { Store, User } from "@prisma/client";
import { UserMenu } from "./user-menu";

export function AppSidebarClient({
  stores = [],
  user,
}: {
  stores: Store[];
  user?: User;
}) {
  const pathname = usePathname();
  const params = useParams();
  const items = [
    {
      title: "Overview",
      url: `/dashboard/${params.storeId}`,
      icon: LayoutDashboard,
    },
    {
      title: "Billboards",
      url: `/dashboard/${params.storeId}/billboards`,
      icon: GalleryVertical,
    },
    {
      title: "Categories",
      url: `/dashboard/${params.storeId}/categories`,
      icon: Library,
    },
    {
      title: "Sizes",
      url: `/dashboard/${params.storeId}/sizes`,
      icon: Scaling,
    },
    {
      title: "Colors",
      url: `/dashboard/${params.storeId}/colors`,
      icon: Palette,
    },
    {
      title: "Products",
      url: `/dashboard/${params.storeId}/products`,
      icon: ShoppingBag,
    },
    {
      title: "Orders",
      url: `/dashboard/${params.storeId}/orders`,
      icon: ShoppingCart,
    },
    {
      title: "Settings",
      url: `/dashboard/${params.storeId}/settings`,
      icon: Settings,
    },
  ];
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex p-6">
          <StoreIcon className="mr-2 size-4" />
          Commerce
        </div>
        <StoreSwitcher items={stores} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive =
                  item.url === `/dashboard/${params.storeId}`
                    ? pathname === item.url
                    : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        className={cn(
                          "text-md font-medium transition-colors hover:text-primary text-black dark:text-white"
                        )}
                        href={item.url}
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
        <UserMenu user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
