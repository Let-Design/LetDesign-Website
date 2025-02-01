import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { SunIcon } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="flex sticky z-[1] top-0 border shadow-md bg-white items-center justify-between py-4 px-6">
      <Link href={"/"}>Logo</Link>
      <div className="flex gap-6 items-center">
        <Link className="hover:underline" href="/design">
          Design
        </Link>
        <Link className="hover:underline" href="/about">
          About
        </Link>
        <Button variant="outline" size="icon">
          <SunIcon />
        </Button>
        <Link
          className={`${buttonVariants({
            variant: "outline",
          })} py-2 px-4 border-2 rounded-md hover:bg-gray-50`}
          href="/login"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};
