import { Category } from "@prisma/client";
import Link from "next/link";
import { MainNav } from "./main-nav";
import { NavbarActions } from "./navbar-actions";

export const Navbar = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="border-b">
      <div className="max-w-7xl mx-auto">
        <div className=" relative flex h-20 items-center">
          <Link href="/">
            <p className="font-semibold text-2xl tracking-tight">STORE</p>
          </Link>
          <div className="flex-1 flex justify-center">
            <MainNav categories={categories} />
          </div>
          <div className="w-[100px] flex justify-end">
            <NavbarActions />
          </div>
        </div>
      </div>
    </div>
  );
};
