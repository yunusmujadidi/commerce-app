"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export interface BillboardColumnProps {
  label: string;
  createdAt: string;
  id: string;
}

export const columns: ColumnDef<BillboardColumnProps>[] = [
  {
    accessorKey: "label",
    header: "Label",
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
