import { Category, Color, Image, Product, Size } from "@prisma/client";
import { z } from "zod";

export interface Products extends Product {
  images: Image[];
  category: Category;
  color: Color;
  size: Size;
}

export type Period = {
  from?: string | Date;
  to?: string | Date;
};

export const orderFormSchema = z.object({
  isPaid: z.boolean(),
  phone: z.string(),
  address: z.string(),
  imageUrl: z.string().url("Need image to submit"),
  storeId: z.string(),
});
