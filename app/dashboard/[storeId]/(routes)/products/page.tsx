import { getProducts } from "@/actions/product-action";
import { format } from "date-fns";
import { ProductClient } from "./client";

const ProductsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const products = await getProducts((await params).storeId);
  const formattedProducts = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
    color: item.color,
    size: item.size,
    category: item.category,
    storeId: item.storeId,
  }));

  return (
    <div className="flex-col w-full">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductClient products={formattedProducts} />
      </div>
    </div>
  );
};
export default ProductsPage;
