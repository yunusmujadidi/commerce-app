"use client";

import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MainNav = ({ categories }: { categories: Category[] }) => {
  const pathname = usePathname();
  const route = categories.map((item) => ({
    href: `/category/${item.id}`,
    label: item.name,
    active: pathname === `/category/${item.id}`,
  }));
  return (
    <nav className="flex items-center space-x-8 ">
      {route.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "font-medium hover:text-black hover:underline transition",
            item.active ? "text-black underline" : "text-neutral-600 "
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
