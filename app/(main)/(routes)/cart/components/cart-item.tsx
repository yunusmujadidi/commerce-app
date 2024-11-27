"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Products } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";

export const CartItem = ({ data }: { data: Products }) => {
  const { removeItem } = useCart();
  return (
    <li className="flex py-6 border-b">
      <div className="relative size-24 rounded-md overflow-hidden sm:size-48">
        <Image
          fill
          src={data.images[0].url}
          alt="Cart Image"
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <Button
            onClick={() => removeItem(data.id)}
            variant="outline"
            size="icon"
            className="rounded-full size-8 bg-white hover:bg-gray-50 hover:scale-110"
          >
            <X className="size-5 text-gray-600" />
          </Button>
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">{data.name}</p>
          </div>
          <div className="mt-1 flex text-sm">
            <p className="text-gray-500 ">{data.color.name}</p>
            <p className="text-gray-500 ml-4 border-l border-gray-200 pl-4 ">
              {data.size.name}
            </p>
          </div>
          {formatPrice.format(data.price)}
        </div>
      </div>
    </li>
  );
};
