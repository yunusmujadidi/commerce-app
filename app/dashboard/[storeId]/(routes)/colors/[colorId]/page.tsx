import { ColorForm } from "@/components/form/color-form";
import { prisma } from "@/lib/prisma";

const ColorPage = async ({
  params,
}: {
  params: Promise<{ storeId: string; colorId: string }>;
}) => {
  const color = await prisma.color.findUnique({
    where: {
      id: (await params).colorId,
    },
  });

  return (
    <div className="flex flex-col w-full">
      <div className="space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
