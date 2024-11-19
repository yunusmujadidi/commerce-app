import { prisma } from "@/lib/prisma";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const store = await prisma.store.findFirst({
    where: {
      id: (await params).storeId,
    },
  });
  return <div>Dashboard Content {store?.name}</div>;
};

export default DashboardPage;
