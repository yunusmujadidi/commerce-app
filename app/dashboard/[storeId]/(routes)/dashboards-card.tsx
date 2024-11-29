"use client";

import { Boxes, CreditCard, DollarSign } from "lucide-react";
import { DashboardCard } from "./dashboard-card";

interface DashboardCardProps {
  totalRevenue: number;
  salesCount: number;
  stockCount: number;
}

export const DashboardCards = ({
  totalRevenue,
  salesCount,
  stockCount,
}: DashboardCardProps) => {
  return (
    <div className="mt-7 gap-4 flex flex-col md:flex-row w-full">
      <DashboardCard
        title="Total Revenue"
        value={totalRevenue}
        price
        icon={DollarSign}
      />
      <DashboardCard title="Sales" value={salesCount} icon={CreditCard} />
      <DashboardCard title="Product in Stock" value={stockCount} icon={Boxes} />
    </div>
  );
};
