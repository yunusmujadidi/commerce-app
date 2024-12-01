import { getCategory } from "@/actions/category-action";
import { getProductsFilter } from "@/actions/product-action";
import { getStoreWithDetails } from "@/actions/store-action";
import { Billboard } from "@/components/billboard";
import { Filter } from "@/components/filter";
import { MobileFilter } from "@/components/mobile-filter";
import { NoResult } from "@/components/no-result";
import { ProductCard } from "@/components/product-card";

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ colorId?: string; sizeId?: string }>;
}) => {
  const { categoryId } = await params;
  const { colorId } = await searchParams;
  const { sizeId } = await searchParams;

  const category = await getCategory(categoryId);

  const store = await getStoreWithDetails(categoryId);

  const products = await getProductsFilter(categoryId, sizeId, colorId);

  if (!store || !category || !products) {
    return <NoResult />;
  }
  return (
    <div className="space-y-8">
      <Billboard data={category?.billboard} />
      <div className="w-full max-w-screen-2xl bg-white px-2 lg:px-8 mx-0 lg:mx-32 ">
        <div className="lg:grid lg:grid-cols-5 lg:gap-x-8 ">
          <div className="block lg:hidden">
            <MobileFilter colors={store.colors} sizes={store.sizes} />
          </div>
          <div className="hidden lg:block ">
            <Filter valueKey="sizeId" name="Sizes" data={store.sizes} />
            <Filter valueKey="colorId" name="Colors" data={store.colors} />
          </div>
          <div className="lg:col-span-4 lg:mt-0 mt-6">
            {products.length === 0 && <NoResult />}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((item) => (
                <ProductCard key={item.id} data={item ?? []} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
