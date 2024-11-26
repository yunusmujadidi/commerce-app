import { Gallery } from "@/components/gallery";
import { Heading } from "@/components/heading";
import { Info } from "@/components/info";
import { Navigation } from "@/components/navigation";
import { NoResult } from "@/components/no-result";
import { ProductList } from "@/components/product-list";
import { prisma } from "@/lib/prisma";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const store = await prisma.store.findFirst({
    include: {
      categories: true,
      billboards: true,
    },
  });

  const { productId } = await params;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true, images: true, size: true, color: true },
  });

  if (!product) {
    return <NoResult />;
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: productId },
    },
    include: {
      images: true,
      category: true,
      color: true,
      size: true,
    },
    take: 4,
  });

  if (!store) {
    return;
  }
  return (
    <div className="bg-white max-w-screen-2xl w-full">
      <div className="px-4 py-2 sm:px-6 lg:px-8 lg:mx-32">
        <div className="my-8">
          <Navigation store={store} />
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
