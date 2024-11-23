"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryColumnProps } from "./column";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onCopy } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { deleteCategories } from "@/actions/category-action";

interface CellActionProps {
  data: CategoryColumnProps;
}

export const CellAction = ({ data }: CellActionProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category."
  );

  const router = useRouter();
  const params = useParams();

  const storeId = params.storeId as string;

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      const result = await deleteCategories({ id: data.id, storeId });

      if (result) {
        toast.success(result.message);
        router.push(`/dashboard/${storeId}/categories`);
        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-2 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 size-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/${storeId}/categories/${data.id}`)
            }
          >
            <Edit className="mr-2 size-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={false}
            onClick={() => {
              handleDelete();
            }}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};