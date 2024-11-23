"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { columns, ProductColumnProps } from "./column";

export const ProductClient = ({
  products,
}: {
  products: ProductColumnProps[];
}) => {
  const params = useParams();
  const router = useRouter();
  console.log("product adalah: ", products);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${products.length})`}
          description="Manage your products for your store"
        />
        <Button
          onClick={() =>
            router.push(`/dashboard/${params.storeId}/products/new`)
          }
        >
          <Plus className="mr-2 product-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={products} filterKey="name" />
    </>
  );
};
