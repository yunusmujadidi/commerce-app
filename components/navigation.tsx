"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Store } from "@prisma/client";
import React from "react";
import Link from "next/link";

const routeLabels: Record<string, string> = {
  billboards: "Billboards",
  products: "Products",
  categories: "Categories",
  sizes: "Sizes",
  colors: "Colors",
  orders: "Orders",
  settings: "Settings",
  product: "Product Details",
};

export const Navigation = ({ store }: { store?: Store }) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isNew = segments[segments.length - 1] === "new";
  const currentRoute = segments[2];

  const getBreadcrumbItems = () => {
    const items = [
      <BreadcrumbItem key="home">
        <BreadcrumbLink asChild>
          <Link href="/">Home</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>,
      <BreadcrumbSeparator key="sep1" />,
    ];

    if (segments[0] === "product") {
      items.push(
        <BreadcrumbItem key="products">
          <BreadcrumbLink asChild>
            <Link href="/products">Products</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>,
        <BreadcrumbSeparator key="sep2" />,
        <BreadcrumbItem key="product">
          <BreadcrumbPage>Product Details</BreadcrumbPage>
        </BreadcrumbItem>
      );
      return items;
    }

    if (store) {
      items.push(
        <BreadcrumbItem key="dashboard">
          <BreadcrumbLink asChild>
            <Link href={`/dashboard/${store.id}`}>Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>,
        <BreadcrumbSeparator key="sep2" />,
        <BreadcrumbItem key="store">
          {segments.length === 2 ? (
            <BreadcrumbPage>{store.name}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={`/dashboard/${store.id}`}>{store.name}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      );

      if (currentRoute) {
        items.push(
          <BreadcrumbSeparator key="sep3" />,
          <BreadcrumbItem key="route">
            {segments.length === 3 ? (
              <BreadcrumbPage>
                {routeLabels[currentRoute] || currentRoute}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={`/dashboard/${store.id}/${currentRoute}`}>
                  {routeLabels[currentRoute] || currentRoute}
                </Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        );

        if (segments.length > 3) {
          items.push(
            <BreadcrumbSeparator key="sep4" />,
            <BreadcrumbItem key="detail">
              <BreadcrumbPage>{isNew ? "Create New" : "Edit"}</BreadcrumbPage>
            </BreadcrumbItem>
          );
        }
      }
    }

    return items;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{getBreadcrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  );
};
