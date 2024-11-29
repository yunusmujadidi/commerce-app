"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import CountUp from "react-countup";
import { formatPrice } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  children?: React.ReactNode;
  icon?: LucideIcon;
  value: number;
  price?: boolean;
}

export const DashboardCard = ({
  title,
  icon: Icon,
  value,
  children,
  price,
}: DashboardCardProps) => {
  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="text-sm font-medium">{title}</div>
          {Icon && <Icon className="size-4 text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <CountUp
            preserveValue
            start={0}
            end={value}
            formattingFn={price ? formatPrice.format : undefined}
          />
        </div>
        {children}
      </CardContent>
    </Card>
  );
};
