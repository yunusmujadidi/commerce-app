"use client";

import { useParams, usePathname } from "next/navigation";

export const SidebarItem = (children: React.ReactNode) => {
  const pathname = usePathname();
  const params = useParams();
  return (
    <Link
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        route.active ? "text-black dark:text-white" : "text-muted-foreground"
      )}
      href={item.url}
    ></Link>
  );
};
