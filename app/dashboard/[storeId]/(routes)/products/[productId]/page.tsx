import { getCategories } from "@/actions/category-action";
import { getColors } from "@/actions/color-action";
import { getSizes } from "@/actions/size-action";
import { ProductForm } from "@/components/form/product-form";
import { prisma } from "@/lib/prisma";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ storeId: string; productId: string }>;
}) => {
  const product = await prisma.product.findUnique({
    where: {
      id: (await params).productId,
    },
    include: {
      images: true,
    },
  });

  const sizes = await getSizes((await params).storeId);
  const colors = await getColors((await params).storeId);
  const categories = await getCategories((await params).storeId);
  console.log("ini initial data:", product);

  return (
    <div className="flex flex-col w-full">
      <div className="space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          SelectProps={{ sizes, colors, categories }}
        />
      </div>
    </div>
  );
};

export default ProductPage;
