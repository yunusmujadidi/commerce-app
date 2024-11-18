"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const createStore = async (values: { name: string }) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.store.create({
      data: {
        name: values.name as string,
        userId: currentUser.user?.id as string,
      },
    });

    return { success: true, message: "Store created succesfully!" };
  } catch (error) {
    console.log("Can't create store", error);
    return { success: false, error: "Failed to create store" };
  }
};
