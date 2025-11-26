"use client";

interface InventoryLayoutProps {
  children: React.ReactNode;
}

export default function ProcureLayout({ children }: InventoryLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="w-full h-full">

            <main className="">{children}</main>
      
        </div>
      </div>
   
  );
}
