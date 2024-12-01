import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { Lato } from "next/font/google";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={cn(lato.className, "antialiased min-h-screen flex flex-col")}
    >
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
