"use server";

import { auth } from "@/auth";
import { sizeFormSchema } from "@/components/form/size-form";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { unstable_cache, revalidatePath } from "next/cache";

const CACHE_TAG_SIZES = "sizes";

export const createSize = async (values: z.infer<typeof sizeFormSchema>) => {
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
    const result = await prisma.size.create({
      data: values,
    });

    revalidatePath("/");
    return { success: true, message: "Size created successfully!", result };
  } catch (error) {
    console.log("Can't create size", error);
    return { success: false, error: "Failed to create size" };
  }
};

export const getSizes = async (storeId: string) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  return unstable_cache(
    async () => {
      return prisma.size.findMany({
        where: { storeId },
        orderBy: { createdAt: "desc" },
      });
    },
    [`${CACHE_TAG_SIZES}-${storeId}`],
    {
      tags: [CACHE_TAG_SIZES, `store-${storeId}`],
      revalidate: 3600, // Cache for 1 hour
    }
  )();
};

export const getSize = async ({ sizesId }: { sizesId: string }) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await prisma.size.findUnique({
      where: {
        id: sizesId,
      },
    });

    return { success: true, result };
  } catch (error) {
    console.log("Can't fetch sizes", error);
    return { success: false, error: "Failed to fetch sizes" };
  }
};

export const editSizes = async (
  values: z.infer<typeof sizeFormSchema> & { id: string }
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
    await prisma.size.updateMany({
      where: {
        id: values.id,
      },
      data: {
        name: values.name,
        value: values.value,
      },
    });

    revalidatePath("/");
    return { success: true, message: `Successfully updated the sizes` };
  } catch (error) {
    console.log("Can't update the sizes", error);
    return { success: false, message: "Failed to update sizes" };
  }
};

export const deleteSizes = async ({
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
    const result = await prisma.size.deleteMany({
      where: {
        id,
      },
    });

    revalidatePath("/");
    return {
      success: true,
      message: `Successfully deleted ${result.count} ${
        result.count > 1 ? "sizes" : "size"
      }`,
    };
  } catch (error) {
    console.log("Cant delete the sizes", error);
    return { success: false, message: "Failed to delete the sizes" };
  }
};
