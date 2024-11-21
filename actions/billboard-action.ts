"use server";

import { auth } from "@/auth";
import { billboardFormSchema } from "@/components/form/billlboards-form";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const createBillboard = async (
  values: z.infer<typeof billboardFormSchema>
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
    const result = await prisma.billboard.create({
      data: values,
    });

    return { success: true, message: "Billboard created succesfully!", result };
  } catch (error) {
    console.log("Can't create billboard", error);
    return { success: false, error: "Failed to create billboard" };
  }
};

export const getBillboards = async (storeId: string) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const getBillboard = async ({
  billboardId,
}: {
  billboardId: string;
}) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await prisma.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return { success: true, result };
  } catch (error) {
    console.log("Can't fetch billboard", error);
    return { success: false, error: "Failed to fetch billboards" };
  }
};

export const editBillboard = async (
  values: z.infer<typeof billboardFormSchema> & { id: string }
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
    await prisma.billboard.updateMany({
      where: {
        id: values.id,
        storeId: values.storeId,
      },
      data: {
        label: values.label,
        imageUrl: values.imageUrl,
      },
    });

    return { success: true, message: `Successfully updated the billboard` };
  } catch (error) {
    console.log("Can't update the billboard", error);
    return { success: false, message: "Failed to update billboard" };
  }
};

export const deleteBillboards = async ({
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
    const result = await prisma.billboard.deleteMany({
      where: {
        id,
      },
    });

    return {
      sucess: true,
      message: `Success deleted ${result.count} billboards `,
    };
  } catch (error) {
    console.log("Cant delete the billboard", error);
    return { success: false, message: "Failed to delete the billboards" };
  }
};
