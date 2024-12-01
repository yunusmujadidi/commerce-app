"use server";

import { auth } from "@/auth";
import { colorFormSchema } from "@/components/form/color-form";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { unstable_cache, revalidatePath } from "next/cache";

const CACHE_TAG_COLORS = "colors";

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

    revalidatePath("/");
    return { success: true, message: "Color created successfully!", result };
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

  return unstable_cache(
    async () => {
      return prisma.color.findMany({
        where: { storeId },
        orderBy: { createdAt: "desc" },
      });
    },
    [`${CACHE_TAG_COLORS}-${storeId}`],
    {
      tags: [CACHE_TAG_COLORS, `store-${storeId}`],
      revalidate: 3600, // Cache for 1 hour
    }
  )();
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

    revalidatePath("/");
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

    revalidatePath("/");
    return {
      success: true,
      message: `Successfully deleted ${result.count} ${
        result.count < 0 ? "colors" : "color"
      }`,
    };
  } catch (error) {
    console.log("Cant delete the colors", error);
    return { success: false, message: "Failed to delete the colors" };
  }
};
