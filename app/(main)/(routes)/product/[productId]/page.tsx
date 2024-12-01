import { getProduct, getProductsSuggest } from "@/actions/product-action";
import { Gallery } from "@/components/gallery";
import { Heading } from "@/components/heading";
import { Info } from "@/components/info";
import { Navigation } from "@/components/navigation";
import { NoResult } from "@/components/no-result";
import { ProductList } from "@/components/product-list";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    return <NoResult />;
  }
  const categoryId = product.categoryId;

  const products = await getProductsSuggest(categoryId, productId);

  return (
    <div className="bg-white max-w-screen-2xl w-full">
      <div className="px-4 py-2 sm:px-6 lg:px-8 lg:mx-32">
        <div className="my-8">
          <Navigation />
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <Gallery images={product.images} />
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <Info product={product} />
          </div>
        </div>
        <Heading className="my-10" title="Related Items" />
        <ProductList products={products} />
      </div>
    </div>
  );
};

export default ProductPage;
