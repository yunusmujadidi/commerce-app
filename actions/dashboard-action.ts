import { prisma } from "@/lib/prisma";

export const getTotalRevenue = async (
  storeId: string,
  searchParams: { from?: string; to?: string }
) => {
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

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((sum, item) => {
      return sum + item.product.price;
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};

export const getSalesCount = async (
  storeId: string,
  searchParams: { from?: string; to?: string }
) => {
  const salesCount = await prisma.order.count({
    where: {
      storeId,
      isPaid: true,
      createdAt: {
        ...(searchParams.from && { gte: new Date(searchParams.from) }),
        ...(searchParams.to && { lte: new Date(searchParams.to) }),
      },
    },
  });
  return salesCount;
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

  const revenuePerMonth = paidOrders.reduce((acc, order) => {
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

  return revenuePerMonth;
};
