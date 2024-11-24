"use server";

import { auth } from "@/auth";
import { orderFormSchema } from "@/components/form/billlboards-form";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const createOrder = async (values: z.infer<typeof orderFormSchema>) => {
  const currentUser = await auth();
  if (!currentUser) {
    return {
      success: false,
      message: "Unauthorized access",
      error: "Unauthorized",
    };
  }

  const storeByUserId = await prisma.store.findFirst({
    where: {
      id: values.storeId,
      userId: currentUser.user?.id,
    },
  });

  if (!storeByUserId) {
    return {
      success: false,
      message: "Unauthorized access",
      error: "Unauthorized",
    };
  }

  try {
    const result = await prisma.order.create({
      data: values,
    });

    return { success: true, message: "Order created succesfully!", result };
  } catch (error) {
    console.log("Can't create order", error);
    return { success: false, error: "Failed to create order" };
  }
};

export const getOrders = async (storeId: string) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const getOrder = async ({ orderId }: { orderId: string }) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    return { success: true, result };
  } catch (error) {
    console.log("Can't fetch order", error);
    return { success: false, error: "Failed to fetch orders" };
  }
};

export const editOrder = async (
  values: z.infer<typeof orderFormSchema> & { id: string }
) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }
  const storeByUserId = await prisma.store.findFirst({
    where: {
      id: values.storeId,
      userId: currentUser.user?.id,
    },
  });

  if (!storeByUserId) {
    return {
      success: false,
      message: "Unauthorized access",
      error: "Unauthorized",
    };
  }

  try {
    await prisma.order.updateMany({
      where: {
        id: values.id,
        storeId: values.storeId,
      },
      data: {
        label: values.label,
        imageUrl: values.imageUrl,
      },
    });

    return { success: true, message: `Successfully updated the order` };
  } catch (error) {
    console.log("Can't update the order", error);
    return { success: false, message: "Failed to update order" };
  }
};

export const deleteOrders = async ({
  storeId,
  id,
}: {
  storeId: string;
  id: string;
}) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauhtorized");
  }

  const storeByUserId = await prisma.store.findFirst({
    where: {
      id: storeId,
      userId: currentUser.user?.id,
    },
  });

  if (!storeByUserId) {
    return {
      success: false,
      message: "Unauthorized access",
      error: "Unauthorized",
    };
  }

  try {
    const result = await prisma.order.deleteMany({
      where: {
        id,
      },
    });

    return {
      sucess: true,
      message: `Success deleted ${result.count} orders `,
    };
  } catch (error) {
    console.log("Cant delete the order", error);
    return { success: false, message: "Failed to delete the orders" };
  }
};
