import Link from "next/link";

export const Footer = () => {
  return (
    <div className="flex items-center justify-center border h-32 mt-4">
      <div className="text-sm font-medium">copyright by yynoes |</div>
      <Link className="text-sm font- ml-1" href="/dashboard">
        <span className="hover:underline">dashboard</span>
      </Link>
    </div>
  );
};
