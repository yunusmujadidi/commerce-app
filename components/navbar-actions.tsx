"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

export const NavbarActions = () => {
  const { items } = useCart();
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.push("/cart");
      }}
      className="rounded-full hover:opacity-90"
    >
      <ShoppingBag className="size-4 mr-1" />
      {items.length}
    </Button>
  );
};
