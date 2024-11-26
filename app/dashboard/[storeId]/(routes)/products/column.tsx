"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Switch } from "@/components/ui/switch";
import { archivedToogle, featuredToogle } from "@/actions/product-action";
import { formatPrice } from "@/lib/utils";

export interface ProductColumnProps {
  id: string;
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  color: { id: string; name: string; value: string };
  size: { id: string; name: string };
  category: { id: string; name: string };
  createdAt: string;
  storeId: string;
}

export const columns: ColumnDef<ProductColumnProps>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category.name,
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color.name}
        <div
          className="size-6 rounded-full border"
          style={{ backgroundColor: row.original.color.value }}
        />
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => row.original.size.name,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return formatPrice.format(row.original.price);
    },
  },

  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Switch
          checked={row.original.isFeatured}
          onCheckedChange={async () => {
            await featuredToogle({
              id: row.original.id,
              storeId: row.original.storeId,
              isFeatured: row.original.isFeatured,
            });
          }}
        />
        <span>{row.original.isFeatured ? "Yes" : "No"}</span>
      </div>
    ),
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Switch
          checked={row.original.isArchived}
          onCheckedChange={async () => {
            await archivedToogle({
              id: row.original.id,
              storeId: row.original.storeId,
              isArchived: row.original.isArchived,
            });
          }}
        />
        <span>{row.original.isArchived ? "Yes" : "No"}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },

  {
    id: "action",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
