import { Billboard as BillboardType } from "@prisma/client";
import Image from "next/image";

interface BillboardProps {
  data: BillboardType;
}

export const Billboard = ({ data }: BillboardProps) => {
  return (
    <div className="flex mt-4 h-32 items-center justify-center w-full">
      <Image
        src={data.imageUrl}
        width={100}
        height={100}
        alt="Billboard Image"
      />
    </div>
  );
};
