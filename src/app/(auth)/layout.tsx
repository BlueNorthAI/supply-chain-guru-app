"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";

  return (
    <main className="bg-[oklch(0.98_0.01_80)] min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-center items-center">
          <div className="flex items-center justify-center gap-2">
          
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-supply-chain-guru/icon-transparent.png"
              alt="Supply Chain Guru"
              width={100}
              height={100}
              className="h-20 w-20"
            />
            <Image
               src="/logo-supply-chain-guru/logo-horizontal-text.png"
              alt="Supply Chain Guru"
              width={400}
              height={400}
              className="h-12 w-auto -ml-2 mt-2"
            />
          
          </Link>
          </div>

          {/* <Button asChild variant="secondary">
            <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
              {isSignIn ? "Sign Up" : "Login"}
            </Link>
          </Button> */}
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;