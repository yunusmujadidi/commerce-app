import { prisma } from "@/lib/prisma";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
    },
  });
  return <div>Dashboard Content {store?.name}</div>;
};

export default DashboardPage;
