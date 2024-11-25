"use client";

import { ColumnDef } from "@tanstack/react-table";

export interface OrderColumnProps {
  id: string;
  phone: string;
  address: string;
  products: string;
  totalPrice: number;
  createdAt: string;
  isPaid: boolean;
}

export const columns: ColumnDef<OrderColumnProps>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => `$${row.original.totalPrice}`,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];