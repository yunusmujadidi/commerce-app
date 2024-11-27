import { Billboard } from "@/components/billboard";
import { prisma } from "@/lib/prisma";
import { Heading } from "@/components/heading";
import { ProductList } from "@/components/product-list";

const Home = async () => {
  const category = await prisma.category.findFirst({
    include: { billboard: true },
  });

  if (!category?.billboard) return null;

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
    },
    include: {
      images: true,
      category: true,
      color: true,
      size: true,
    },
  });

  return (
    <>
      <Billboard data={category.billboard} />
      <div className="flex flex-col gap-y-8 px-4 md:px-6 mx-0 xl:mx-32">
        <Heading title="Featured Products" className="my-6" />
        <ProductList products={products} />
      </div>
    </>
  );
};

export default Home;
