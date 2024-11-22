"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColorColumnProps } from "./column";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onCopy } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { deleteColors } from "@/actions/color-action";

interface CellActionProps {
  data: ColorColumnProps;
}

export const CellAction = ({ data }: CellActionProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this color."
  );

  const router = useRouter();
  const params = useParams();

  const storeId = params.storeId as string;

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      const result = await deleteColors({ id: data.id, storeId });

      if (result) {
        toast.success(result.message);
        router.push(`/dashboard/${storeId}/colors`);
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
          <Button variant="ghost" className="color-2 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="color-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 color-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/${storeId}/colors/${data.id}`)
            }
          >
            <Edit className="mr-2 color-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={false}
            onClick={() => {
              handleDelete();
            }}
          >
            <Trash className="color-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
