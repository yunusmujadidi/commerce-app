import { Billboard } from "@/components/billboard";
import { prisma } from "@/lib/prisma";
import { Heading } from "@/components/heading";
import { ProductList } from "@/components/product-list";

interface HomeProps {
  params: { categoryId?: string };
}

const Home = async ({ params }: HomeProps) => {
  const { categoryId } = params;

  const fetchDefaultCategory = async () => {
    return await prisma.category.findFirst({
      where: { name: "Home" },
      include: { billboard: true },
    });
  };

  const category = categoryId
    ? await prisma.category.findUnique({
        where: { id: categoryId },
        include: { billboard: true },
      })
    : null;

  const data = category?.billboard || (await fetchDefaultCategory())?.billboard;

  if (!data) return;

  const products = await prisma.product.findMany({
    include: {
      images: true,
      category: true,
      color: true,
      size: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <Billboard data={data} />
      <div className="flex flex-col gap-y-8 px-4 md:px-6 mx-0 xl:mx-32">
        <Heading title="Featured Products" className="my-6" />
        <ProductList products={products} />
      </div>
    </>
  );
};

export default Home;
