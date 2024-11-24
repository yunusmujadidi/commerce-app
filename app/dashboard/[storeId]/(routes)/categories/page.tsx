import { CategoryClient } from "./category-client";
import { format } from "date-fns";
import { getCategories } from "@/actions/category-action";

const CategoriesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const categories = await getCategories((await params).storeId);
  const formattedCategories = categories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "dd MMMM yyyy"),
    billboardLabel: item.billboard.label,
  }));

  return (
    <div className="flex-col w-full">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <CategoryClient categories={formattedCategories} />
      </div>
    </div>
  );
};
export default CategoriesPage;
