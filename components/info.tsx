import { formatPrice } from "@/lib/utils";
import { Color, Product, Size } from "@prisma/client";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";

interface InfoProps extends Product {
  size: Size;
  color: Color;
}

export const Info = ({ product }: { product: InfoProps }) => {
  return (
    <div>
      <h1 className="font-bold text-3xl text-gray-900">{product.name}</h1>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-2xl text-gray-900">
          {formatPrice.format(product.price)}
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Size:</h3>
          <div>{product.size.name}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Color:</h3>
          <div
            className="size-6 rounded-full border"
            style={{ backgroundColor: product.color.value }}
          />
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button className="rounded-full flex items-center gap-x-2 hover:opacity-90">
          Add to cart <ShoppingCart />
        </Button>
      </div>
    </div>
  );
};
