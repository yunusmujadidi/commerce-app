"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const submitRegister = async (values: {
  email: string;
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(values.password, 10);
  try {
    const result = await prisma.user.create({
      data: {
        email: values.email,
        password: hashedPassword,
      },
    });

    return { success: true, result };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "An error has occurred. Please try again" };
  }
};
