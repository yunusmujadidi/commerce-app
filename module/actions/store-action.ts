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

export const getStore = async () => {
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
