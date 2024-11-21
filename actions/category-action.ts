"use server";

import { auth } from "@/auth";
import { categoryFormSchema } from "@/components/form/category-form";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const createCategory = async (
  values: z.infer<typeof categoryFormSchema>
) => {
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
    const result = await prisma.category.create({
      data: values,
    });

    return { success: true, message: "Category created succesfully!", result };
  } catch (error) {
    console.log("Can't create category", error);
    return { success: false, error: "Failed to create category" };
  }
};

export const getCategories = async (storeId: string) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.category.findMany({
    where: {
      storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const getCategory = async ({ categoryId }: { categoryId: string }) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return { success: true, result };
  } catch (error) {
    console.log("Can't fetch category", error);
    return { success: false, error: "Failed to fetch categorys" };
  }
};

export const editCategory = async (
  values: z.infer<typeof categoryFormSchema> & { id: string }
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
    await prisma.category.updateMany({
      where: {
        id: values.id,
      },
      data: {
        name: values.name,
        billboardId: values.billboardId,
      },
    });

    return { success: true, message: `Successfully updated the category` };
  } catch (error) {
    console.log("Can't update the category", error);
    return { success: false, message: "Failed to update category" };
  }
};

export const deleteCategories = async ({
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
    const result = await prisma.category.deleteMany({
      where: {
        id,
      },
    });

    return {
      sucess: true,
      message: `Success deleted ${result.count} categorys `,
    };
  } catch (error) {
    console.log("Cant delete the category", error);
    return { success: false, message: "Failed to delete the categorys" };
  }
};
