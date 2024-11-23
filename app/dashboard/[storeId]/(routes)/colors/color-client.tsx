"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { columns, ColorColumnProps } from "./column";

export const ColorClient = ({ colors }: { colors: ColorColumnProps[] }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${colors.length})`}
          description="Manage your colors for your store"
        />
        <Button
          onClick={() => router.push(`/dashboard/${params.storeId}/colors/new`)}
        >
          <Plus className="mr-2 color-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={colors} filterKey="name" />
    </>
  );
};
