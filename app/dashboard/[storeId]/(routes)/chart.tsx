"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fillMissingMonths } from "@/lib/utils";

// TODO: fix responsiveness on md and lg

type ChartData = {
  [key: string]: number;
};

const formatMonth = (month: string) => {
  const date = new Date(`${month}-01`);
  return date.toLocaleString("default", { month: "short" });
};

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

export const Chart = ({ chartData }: { chartData: ChartData }) => {
  const filledChartData = fillMissingMonths(chartData);

  const chartConfig = {
    value: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="mt-7">
      <CardHeader>
        <CardTitle>
          <div className="text-sm font-medium">Overview</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            width={600}
            height={300}
            data={filledChartData}
            margin={{ left: 50 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={formatMonth}
            />
            <YAxis tickFormatter={formatRupiah} />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
              formatter={formatRupiah}
            />
            <Bar dataKey="value" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
