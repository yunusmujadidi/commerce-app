"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { checkout } from "@/actions/checkout-action";

export const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const totalPrice = items.reduce((total, item) => {
    return total + item.price;
  }, 0);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [removeAll, searchParams]);

  const onCheckout = async (productIds: string[]) => {
    try {
      const url = await checkout(productIds);
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="px-4 sm:p-6 py-6 mt-16 rounded-lg bg-gray-50 lg:col-span-5 lg:mt-0 lg:p-8">
        <h2 className="text-lg text-gray-900 font-medium">Order Summary</h2>
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-base font-medium text-gray-900">
              Order total
            </div>
            <div>{formatPrice.format(totalPrice)}</div>
          </div>
        </div>

        <Button
          onClick={() => onCheckout(items.map((item) => item.id))}
          className="rounded-full w-full mt-6"
        >
          Checkout
        </Button>
      </div>
    </Suspense>
  );
};
