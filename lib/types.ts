import { Category, Color, Image, Product, Size } from "@prisma/client";

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
