"use server";

import { revalidatePath } from "next/cache";

export const clearCache = async () => {
  revalidatePath("/");
};
