import { NoResult } from "@/components/no-result";
import { ProductCard } from "./product-card";
import { Products } from "@/lib/types";

export const ProductList = ({ products }: { products: Products[] }) => {
  return (
    <>
      {products.length === 0 && <NoResult />}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </>
  );
};
