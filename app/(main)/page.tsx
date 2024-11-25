import { Billboard } from "@/components/billboard";
import { prisma } from "@/lib/prisma";
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

  if (!data) {
    return;
  }

  return <Billboard data={data} />;
};

export default Home;
