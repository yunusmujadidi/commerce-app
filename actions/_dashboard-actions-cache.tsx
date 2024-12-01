"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const CACHE_TAG_DASHBOARD = "dashboard";

export const getTotalRevenue = async (
  storeId: string,
  searchParams: { from?: string; to?: string }
) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  return unstable_cache(
    async () => {
      const paidOrders = await prisma.order.findMany({
        where: {
          storeId,
          isPaid: true,
          createdAt: {
            ...(searchParams.from && { gte: new Date(searchParams.from) }),
            ...(searchParams.to && { lte: new Date(searchParams.to) }),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((sum, item) => {
          return sum + item.product.price;
        }, 0);
        return total + orderTotal;
      }, 0);
    },
    [`${CACHE_TAG_DASHBOARD}-revenue-${storeId}`],
    {
      tags: [CACHE_TAG_DASHBOARD, `store-${storeId}`],
      revalidate: 3600,
    }
  )();
};

export const getSalesCount = async (
  storeId: string,
  searchParams: { from?: string; to?: string }
) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  return unstable_cache(
    async () => {
      return prisma.order.count({
        where: {
          storeId,
          isPaid: true,
          createdAt: {
            ...(searchParams.from && { gte: new Date(searchParams.from) }),
            ...(searchParams.to && { lte: new Date(searchParams.to) }),
          },
        },
      });
    },
    [`${CACHE_TAG_DASHBOARD}-sales-${storeId}`],
    {
      tags: [CACHE_TAG_DASHBOARD, `store-${storeId}`],
      revalidate: 3600,
    }
  )();
};

export const getStockCount = async (storeId: string) => {
  const stockCount = await prisma.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return stockCount;
};

export const getDashboardChart = async (params: { storeId: string }) => {
  const currentUser = await auth();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  return unstable_cache(
    async () => {
      const paidOrders = await prisma.order.findMany({
        where: {
          storeId: params.storeId,
          isPaid: true,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return paidOrders.reduce((acc, order) => {
        const month = order.createdAt.getMonth();
        const year = order.createdAt.getFullYear();
        const key = `${year}-${month + 1}`;

        const orderTotal = order.orderItems.reduce((sum, item) => {
          return sum + item.product.price;
        }, 0);

        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += orderTotal;

        return acc;
      }, {} as Record<string, number>);
    },
    [`${CACHE_TAG_DASHBOARD}-chart-${params.storeId}`],
    {
      tags: [CACHE_TAG_DASHBOARD, `store-${params.storeId}`],
      revalidate: 3600,
    }
  )();
};
