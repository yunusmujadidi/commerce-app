interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const storeId = (await params).storeId;
  return <div>Dashboard Content {storeId}</div>;
};

export default DashboardPage;
