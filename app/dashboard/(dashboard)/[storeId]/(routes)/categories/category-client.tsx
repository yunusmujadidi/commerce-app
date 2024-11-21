"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CategoryColumnProps, columns } from "./column";
import { DataTable } from "./data-table";

export const CategoryClient = ({
  categories,
}: {
  categories: CategoryColumnProps[];
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categories.length})`}
          description="Manage your categories for your store"
        />
        <Button
          onClick={() =>
            router.push(`/dashboard/${params.storeId}/categories/new`)
          }
        >
          <Plus className="mr-2 size-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={categories} searchKey="name" />
    </>
  );
};
