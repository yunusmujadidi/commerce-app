import { getOrders } from "@/actions/order-action";
import { OrdersClient } from "./client";
import { format } from "date-fns";
import { OrderColumnProps } from "./column";

const OrdersPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const orders = await getOrders((await params).storeId);
  const formattedOrders: OrderColumnProps[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: item.orderItems.reduce((total, item) => {
      return total + item.product.price;
    }, 0),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "dd MMMM yyyy"),
  }));

  return (
    <div className="flex-col w-full">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <OrdersClient orders={formattedOrders} />
      </div>
    </div>
  );
};
export default OrdersPage;
