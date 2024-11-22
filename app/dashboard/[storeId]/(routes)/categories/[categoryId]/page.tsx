import { getBillboards } from "@/actions/billboard-action";
import { CategoryForm } from "@/components/form/category-form";
import { prisma } from "@/lib/prisma";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ storeId: string; categoryId: string }>;
}) => {
  const category = await prisma.category.findUnique({
    where: {
      id: (await params).categoryId,
    },
  });

  const billboards = await getBillboards((await params).storeId);
  return (
    <div className="flex flex-col w-full">
      <div className="space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
