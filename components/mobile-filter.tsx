"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Filter } from "./filter";
import { Color, Size } from "@prisma/client";

interface MobileFilterProps {
  sizes: Size[];
  colors: Color[];
}

export const MobileFilter = ({ sizes, colors }: MobileFilterProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Filter <Plus className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Set filter to the products</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Filter valueKey="sizeId" name="Sizes" data={sizes} />
          <Filter valueKey="colorId" name="Colors" data={colors} />
          <DrawerClose asChild>
            <Button className="w-full">
              Filter <Plus className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
