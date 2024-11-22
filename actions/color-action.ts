"use server";

import { auth } from "@/auth";
import { colorFormSchema } from "@/components/form/color-form";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const createColor = async (values: z.infer<typeof colorFormSchema>) => {
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
    const result = await prisma.color.create({
      data: values,
    });

    return { success: true, message: "Color created succesfully!", result };
  } catch (error) {
    console.log("Can't create color", error);
    return { success: false, error: "Failed to create color" };
  }
};

export const getColors = async (storeId: string) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const getColor = async ({ colorsId }: { colorsId: string }) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await prisma.color.findUnique({
      where: {
        id: colorsId,
      },
    });

    return { success: true, result };
  } catch (error) {
    console.log("Can't fetch colors", error);
    return { success: false, error: "Failed to fetch colors" };
  }
};

export const editColors = async (
  values: z.infer<typeof colorFormSchema> & { id: string }
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
    await prisma.color.updateMany({
      where: {
        id: values.id,
      },
      data: {
        name: values.name,
        value: values.value,
      },
    });

    return { success: true, message: `Successfully updated the colors` };
  } catch (error) {
    console.log("Can't update the colors", error);
    return { success: false, message: "Failed to update colors" };
  }
};

export const deleteColors = async ({
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
    const result = await prisma.color.deleteMany({
      where: {
        id,
      },
    });

    return {
      sucess: true,
      message: `Success deleted ${result.count} ${
        result.count < 0 ? "colors" : "color"
      } `,
    };
  } catch (error) {
    console.log("Cant delete the colors", error);
    return { success: false, message: "Failed to delete the colors" };
  }
};
