"use server";

import { auth } from "@/auth";
import { productFormSchema } from "@/components/form/product-form";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { unstable_cache, revalidatePath } from "next/cache";

const CACHE_TAG_PRODUCTS = "products";

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

    revalidatePath("/");
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

    revalidatePath("/");
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
  return unstable_cache(
    async () => {
      return prisma.product.findMany({
        where: { storeId },
        orderBy: { createdAt: "desc" },
        include: {
          size: { select: { id: true, name: true } },
          color: { select: { id: true, name: true, value: true } },
          category: { select: { id: true, name: true } },
        },
      });
    },
    [`${CACHE_TAG_PRODUCTS}-${storeId}`],
    {
      tags: [CACHE_TAG_PRODUCTS, `store-${storeId}`],
      revalidate: 3600, // Cache for 1 hour
    }
  )();
};

export const getProductsSuggest = async (
  productId: string,
  categoryId: string
) => {
  return unstable_cache(
    async () => {
      return prisma.product.findMany({
        where: {
          categoryId: categoryId,
          id: { not: productId },
        },
        include: {
          images: true,
          category: true,
          color: true,
          size: true,
        },
        take: 4,
      });
    },
    [`${CACHE_TAG_PRODUCTS}-${productId}`],
    {
      tags: [CACHE_TAG_PRODUCTS, `store-${productId}`],
      revalidate: 3600, // Cache for 1 hour
    }
  )();
};
export const getProductsFilter = async (
  categoryId: string,
  sizeId?: string,
  colorId?: string
) => {
  const result = await unstable_cache(
    async () =>
      prisma.product.findMany({
        where: {
          categoryId,
          ...(sizeId && { sizeId }),
          ...(colorId && { colorId }),
          isArchived: false,
        },
        include: {
          images: true,
          category: true,
          color: true,
          size: true,
        },
      }),
    [`products-filter-${categoryId}-${sizeId}-${colorId}`],
    {
      revalidate: 3600, // Cache for 1 hour
    }
  )();

  return result;
};

export const getProductsMainPage = async (storeId?: string) => {
  return unstable_cache(
    async () => {
      return prisma.product.findMany({
        where: {
          isFeatured: true,
        },
        include: {
          images: true,
          category: true,
          color: true,
          size: true,
        },
      });
    },
    [`${CACHE_TAG_PRODUCTS}-${storeId}`],
    {
      tags: [CACHE_TAG_PRODUCTS, `store-${storeId}`],
      revalidate: 3600, // Cache for 1 hour
    }
  )();
};

export const getProduct = async (productId: string) => {
  return unstable_cache(
    async () => {
      return prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          images: true,
          category: true,
          color: true,
          size: true,
        },
      });
    },
    [`${CACHE_TAG_PRODUCTS}-${productId}`],
    {
      tags: [CACHE_TAG_PRODUCTS, `product-${productId}`],
      revalidate: 3600, // Cache for 1 hour
    }
  )();
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

    revalidatePath("/");
    return {
      success: true,
      message: `Successfully deleted ${result.count} ${
        result.count === 1 ? "product" : "products"
      }`,
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

  try {
    await prisma.product.updateMany({
      where: { id, storeId },
      data: { isFeatured: !isFeatured },
    });

    revalidatePath("/");
    return { success: true, message: "Featured status updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update featured status",
      error,
    };
  }
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

  try {
    await prisma.product.updateMany({
      where: { id, storeId },
      data: { isArchived: !isArchived },
    });

    revalidatePath("/");
    return { success: true, message: "Archive status updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update archive status",
      error,
    };
  }
};
