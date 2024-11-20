"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export const BillboardsClient = () => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Billboards (0)"
          description="Manage your billboards for your store"
        />
        <Button
          onClick={() =>
            router.push(`/dashboard/${params.storeId}/billboards/new`)
          }
        >
          <Plus className="mr-2 size-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <div>BillboardTabel</div>
    </>
  );
};
