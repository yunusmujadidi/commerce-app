import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  getDashboardChart,
  getSalesCount,
  getStockCount,
  getTotalRevenue,
} from "@/actions/dashboard-action";
import { DashboardCards } from "./dashboards-card";
import { Chart } from "./chart";
import { DateFilter } from "./date-filter";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}

const DashboardPage = async ({ params, searchParams }: DashboardPageProps) => {
  const store = await prisma.store.findFirst({
    where: {
      id: (await params).storeId,
    },
  });

  if (!store) {
    redirect("/dashboard");
  }

  const totalRevenue = await getTotalRevenue(store.id, await searchParams);
  const salesCount = await getSalesCount(store.id, await searchParams);
  const stockCount = await getStockCount(store.id);
  const chartData = await getDashboardChart({
    storeId: (await params).storeId,
  });
  console.log(chartData);
  return (
    <div className="py-6 px-8 ">
      <div className="flex justify-between">
        <Heading
          className="mb-4"
          title={`${store.name} Dashboard`}
          description="Overview of your store"
        />
        <DateFilter />
      </div>
      <Separator />
      <DashboardCards
        totalRevenue={totalRevenue}
        salesCount={salesCount}
        stockCount={stockCount}
      />
      <Chart chartData={chartData} />
    </div>
  );
};

export default DashboardPage;
