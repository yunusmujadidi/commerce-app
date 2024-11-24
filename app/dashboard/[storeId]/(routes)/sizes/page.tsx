import { getSizes } from "@/actions/size-action";
import { format } from "date-fns";
import { SizeClient } from "./size-client";

const SizesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const sizes = await getSizes((await params).storeId);
  const formattedSizes = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "dd MMMM yyyy"),
  }));

  return (
    <div className="flex-col w-full">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SizeClient sizes={formattedSizes} />
      </div>
    </div>
  );
};
export default SizesPage;
