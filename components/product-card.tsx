"use client";

import { Products } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Expand, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { usePreviewModal } from "@/hooks/use-preview-modal";

export const ProductCard = ({ data }: { data: Products }) => {
  const router = useRouter();
  const { onOpen } = usePreviewModal();
  return (
    <Card
      className="group hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer"
      onClick={() => {
        router.push(`/product/${data.id}`);
      }}
    >
      <CardHeader className="p-0 relative bg-gray-50">
        <div className="aspect-square rounded-t-xl relative overflow-hidden m-4">
          <Image
            src={data.images[0].url}
            alt={data.name}
            fill
            className="object-cover transition-transform "
          />
          <div className="opacity-0 group-hover:opacity-100 absolute transition w-full px-4 bottom-5 z-10">
            <div className="flex gap-x-2 justify-center">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(data);
                }}
                variant="outline"
                size="icon"
                className="rounded-full size-8 bg-white hover:bg-gray-50 hover:scale-110"
              >
                <Expand className="size-5 text-gray-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full size-8 bg-white hover:bg-gray-50 hover:scale-110"
              >
                <ShoppingCart className="size-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-4 flex-grow">
        <div className="space-y-1">
          <h3 className="font-semibold text-base line-clamp-2">{data.name}</h3>
          <p className="text-sm text-muted-foreground">{data.category?.name}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="font-semibold text-sm md:text-lg">
          {formatPrice.format(data.price)}
        </div>
      </CardFooter>
    </Card>
  );
};
