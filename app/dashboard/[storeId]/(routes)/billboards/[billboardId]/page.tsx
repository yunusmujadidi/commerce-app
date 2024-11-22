import { BillboardsForm } from "@/components/form/billlboards-form";
import { prisma } from "@/lib/prisma";

const BillboardPage = async ({
  params,
}: {
  params: Promise<{ billboardId: string }>;
}) => {
  const billboard = await prisma.billboard.findUnique({
    where: {
      id: (await params).billboardId,
    },
  });
  return (
    <div className="flex flex-col w-full">
      <div className="space-y-4 p-8 pt-6">
        <BillboardsForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
