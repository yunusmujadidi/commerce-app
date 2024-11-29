"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { Product } from "@prisma/client";
import Stripe from "stripe";

export async function checkout(productIds: string[]): Promise<string> {
  if (!productIds || productIds.length === 0) {
    throw new Error("Product ids are required");
  }

  const procucts = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  });

  const response = await fetch(
    "https://api.exchangerate-api.com/v4/latest/IDR"
  );
  const exchangeData = await response.json();
  const idrToUsdRate = exchangeData.rates.USD;

  const products = procucts.map((product) => ({
    ...product,
    price: Math.round(product.price * idrToUsdRate * 100),
  }));

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  products.forEach((product: Product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price,
      },
    });
  });

  const store = await prisma.store.findFirstOrThrow();

  const order = await prisma.order.create({
    data: {
      storeId: store?.id,
      isPaid: false,
      orderItems: {
        create: productIds.map((id: string) => ({
          product: {
            connect: {
              id,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/cart?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }
  return session.url;
}
