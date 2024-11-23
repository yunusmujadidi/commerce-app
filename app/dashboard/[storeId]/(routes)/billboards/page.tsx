import { getBillboards } from "@/actions/billboard-action";
import { BillboardsClient } from "./billboard-client";
import { format } from "date-fns";

const BillboardsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const billboards = await getBillboards((await params).storeId);
  const formattedBillboards = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));

  return (
    <div className="flex-col w-full">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardsClient billboards={formattedBillboards} />
      </div>
    </div>
  );
};
export default BillboardsPage;
