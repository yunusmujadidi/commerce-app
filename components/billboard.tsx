import { Billboard as BillboardType } from "@prisma/client";
import Image from "next/image";

interface BillboardProps {
  data: BillboardType;
}

export const Billboard = ({ data }: BillboardProps) => {
  return (
    <div className="flex h-[150px] md:h-[300px] justify-center items-center overflow-hidden w-full">
      <Image
        src={data.imageUrl}
        alt="Billboard Image"
        width="1500"
        height="300"
        className="w-full h-full object-cover "
      />
      <div className="absolute text-black font-bold text-2xl md:text-3xl lg:text-4xl w-1/2 text-center tracking-tighter">
        {data.label}
      </div>
    </div>
  );
};
