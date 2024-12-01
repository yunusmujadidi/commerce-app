import Link from "next/link";
import { MainNav } from "./main-nav";
import { NavbarActions } from "./navbar-actions";
import { getCategories } from "@/actions/category-action";

export const Navbar = async () => {
  const categories = await getCategories();
  return (
    <div className="border-b">
      <div className="max-w-7xl mx-auto">
        <div className="relative px-4 lg:px-0 flex h-20 items-center lg:justify-between">
          <Link href="/">
            <p className="font-semibold text-2xl tracking-tight">STORE</p>
          </Link>
          <div className="hidden md:block">
            <MainNav categories={categories} />
          </div>
          <div className="ml-auto lg:ml-0">
            <NavbarActions />
          </div>
        </div>
      </div>
    </div>
  );
};
