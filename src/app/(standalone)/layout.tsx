import Image from "next/image";
import Link from "next/link";

import { UserButton } from "@/features/auth/components/user-button";

interface StandloneLayoutProps {
  children: React.ReactNode;
};

const StandloneLayout = ({ children }: StandloneLayoutProps) => {
  return ( 
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-supply-chain-guru/icon-transparent.png" alt="logo" width={40} height={40} />
            <Image src="/logo-supply-chain-guru/logo-horizontal-text.png" alt="logo" width={200} height={200} />
            <h1 className="font-sans text-2xl font-bold text-[#05022d]">BlueNorth AI</h1>
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}
 
export default StandloneLayout;