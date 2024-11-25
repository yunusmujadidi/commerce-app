import { ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";

export const NavbarActions = () => {
  return (
    <Button className="rounded-full hover:opacity-90">
      <ShoppingBag className="size-4 mr-1" />
      (2)
    </Button>
  );
};
