import { getColors } from "@/actions/color-action";
import { format } from "date-fns";
import { ColorClient } from "./color-client";

const ColorsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const colors = await getColors((await params).storeId);
  const formattedColors = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "dd MMMM yyyy"),
  }));

  return (
    <div className="flex-col w-full">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ColorClient colors={formattedColors} />
      </div>
    </div>
  );
};
export default ColorsPage;
