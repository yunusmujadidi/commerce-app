import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumnProps, columns } from "./column";
import { DataTable } from "@/components/data-table";

export const OrdersClient = ({ orders }: { orders: OrderColumnProps[] }) => {
  return (
    <>
      <Heading
        title={`Orders (${orders.length})`}
        description="Manage your orders for your store"
      />

      <Separator />
      <DataTable columns={columns} data={orders} filterKey="products" />
    </>
  );
};
