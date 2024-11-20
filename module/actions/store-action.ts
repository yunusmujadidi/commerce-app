"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const createStore = async (values: { name: string }) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await prisma.store.create({
      data: {
        name: values.name as string,
        userId: currentUser.user?.id as string,
      },
    });

    return { success: true, message: "Store created succesfully!", result };
  } catch (error) {
    console.log("Can't create store", error);
    return { success: false, error: "Failed to create store" };
  }
};

export const getStores = async () => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await prisma.store.findMany({
      where: {
        userId: currentUser.user?.id,
      },
    });

    return { success: true, result };
  } catch (error) {
    console.log("Can't fetch store", error);
    return { success: false, error: "Failed to fetch store" };
  }
};

export const getStore = async ({ storeId }: { storeId: string }) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
    });

    return { success: true, result };
  } catch (error) {
    console.log("Can't fetch store", error);
    return { success: false, error: "Failed to fetch stores" };
  }
};

export const editStore = async ({
  storeId,
  name,
}: {
  storeId: string;
  name: string;
}) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauhtorized");
  }

  try {
    await prisma.store.updateMany({
      where: {
        id: storeId,
        userId: currentUser.user?.id,
      },
      data: {
        name,
      },
    });

    return { sucess: true, message: `Success updated to ${name}` };
  } catch (error) {
    console.log("Cant update the store", error);
    return { success: false, message: "Failed to fetch stores" };
  }
};

export const deleteStores = async ({ storeId }: { storeId: string }) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauhtorized");
  }

  try {
    const result = await prisma.store.deleteMany({
      where: {
        id: storeId,
        userId: currentUser.user?.id,
      },
    });

    return {
      sucess: true,
      message: `Success deleted ${result.count} stores `,
    };
  } catch (error) {
    console.log("Cant delete the store", error);
    return { success: false, message: "Failed to delete the stores" };
  }
};
