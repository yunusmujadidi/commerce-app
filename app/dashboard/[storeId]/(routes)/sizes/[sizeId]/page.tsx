import { SizeForm } from "@/components/form/size-form";
import { prisma } from "@/lib/prisma";

const SizePage = async ({
  params,
}: {
  params: Promise<{ storeId: string; sizeId: string }>;
}) => {
  const size = await prisma.size.findUnique({
    where: {
      id: (await params).sizeId,
    },
  });

  return (
    <div className="flex flex-col w-full">
      <div className="space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
