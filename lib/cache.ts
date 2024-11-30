import { revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  stores: "stores",
  products: "products",
  categories: "categories",
  billboards: "billboards",
  sizes: "sizes",
  colors: "colors",
  orders: "orders",
  stats: "stats",
} as const;

export const invalidateCache = (tags: string[]) => {
  tags.forEach((tag) => revalidateTag(tag));
};
