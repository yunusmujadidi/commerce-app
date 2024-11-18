import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out";
import { redirect } from "next/navigation";
import React from "react";

const Home = async () => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div>
      <SignOutButton />
      zxc
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
};

export default Home;
