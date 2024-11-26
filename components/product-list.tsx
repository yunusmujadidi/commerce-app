import { NoResult } from "@/components/no-result";
import { ProductCard } from "./product-card";
import { Products } from "@/lib/types";

export const ProductList = ({ products }: { products: Products[] }) => {
  console.log("rpdocust adalaah:", products);
  return (
    <div className="space-y-4">
      {products.length === 0 && <NoResult />}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};