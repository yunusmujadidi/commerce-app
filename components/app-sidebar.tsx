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
import {
  GalleryVertical,
  LayoutDashboard,
  Library,
  Palette,
  Scaling,
  Settings,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "Overview",
    url: "/dashboard/${store.id}",
    icon: LayoutDashboard,
  },
  {
    title: "Billboars",
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

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div>combobox</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
