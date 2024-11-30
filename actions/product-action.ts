"use server";

import { auth } from "@/auth";
import { productFormSchema } from "@/components/form/product-form";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
export const createProducts = async (
  values: z.infer<typeof productFormSchema>
) => {
  try {
    console.log("Starting product creation with values:", values);

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

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Create the product
      const product = await prisma.product.create({
        data: {
          name: values.name,
          price: values.price,
          categoryId: values.categoryId,
          colorId: values.colorId,
          sizeId: values.sizeId,
          storeId: values.storeId,
          isFeatured: values.isFeatured,
          isArchived: values.isArchived,
        },
      });

      console.log("Created product:", product);

      // Create images if they exist
      if (values.images && values.images.length > 0) {
        console.log("Creating images for product:", product.id);

        // Create images one by one to ensure all are created
        for (const image of values.images) {
          await prisma.image.create({
            data: {
              url: image.url,
              productId: product.id,
            },
          });
        }
      }

      // Fetch the complete product with images
      const completeProduct = await prisma.product.findUnique({
        where: { id: product.id },
        include: {
          images: true,
          category: true,
          size: true,
          color: true,
        },
      });

      console.log("Final product with images:", completeProduct);

      return completeProduct;
    });

    return {
      success: true,
      message: "Product created successfully!",
      result: result,
    };
  } catch (error) {
    console.error("Error in createProducts:", error);
    return {
      success: false,
      message: "Failed to create product",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Edit product action should also be updated to handle images properly
export const editProducts = async (
  values: z.infer<typeof productFormSchema> & { id: string }
) => {
  try {
    const currentUser = await auth();
    if (!currentUser) {
      return {
        success: false,
        message: "Unauthorized access",
        error: "Unauthorized",
      };
    }

    // First, delete existing images
    await prisma.image.deleteMany({
      where: {
        productId: values.id,
      },
    });

    // Update product
    const product = await prisma.product.update({
      where: {
        id: values.id,
      },
      data: {
        name: values.name,
        price: values.price,
        categoryId: values.categoryId,
        colorId: values.colorId,
        sizeId: values.sizeId,
        storeId: values.storeId,
        isFeatured: values.isFeatured,
        isArchived: values.isArchived,
      },
    });

    // Create new images
    if (values.images && values.images.length > 0) {
      await prisma.image.createMany({
        data: values.images.map((image) => ({
          url: image.url,
          productId: product.id,
        })),
      });
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: true },
    });

    return {
      success: true,
      message: "Product updated successfully!",
      result: updatedProduct,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: "Failed to update product",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getProducts = async (storeId: string) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.product.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      size: {
        select: {
          id: true,
          name: true,
        },
      },
      color: {
        select: {
          id: true,
          name: true,
          value: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};

export const getProduct = async ({ productsId }: { productsId: string }) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await prisma.product.findUnique({
      where: {
        id: productsId,
      },
    });

    return { success: true, result };
  } catch (error) {
    console.log("Can't fetch products", error);
    return { success: false, error: "Failed to fetch products" };
  }
};

export const deleteProducts = async ({
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
    const result = await prisma.product.deleteMany({
      where: {
        id,
      },
    });

    return {
      sucess: true,
      message: `Success deleted ${result.count} ${
        result.count < 0 ? "products" : "product"
      } `,
    };
  } catch (error) {
    console.log("Cant delete the products", error);
    return { success: false, message: "Failed to delete the products" };
  }
};

export const featuredToogle = async ({
  id,
  storeId,
  isFeatured,
}: {
  id: string;
  storeId: string;
  isFeatured: boolean;
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
  await prisma.product.updateMany({
    where: {
      id,
      storeId,
    },
    data: {
      isFeatured: !isFeatured,
    },
  });
};

export const archivedToogle = async ({
  id,
  storeId,
  isArchived,
}: {
  id: string;
  storeId: string;
  isArchived: boolean;
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
  await prisma.product.updateMany({
    where: {
      id,
      storeId,
    },
    data: {
      isArchived: !isArchived,
    },
  });
};
