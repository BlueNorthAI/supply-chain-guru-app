import Image from "next/image";
import Link from "next/link";

import { Projects } from "./projects";
import { Navigation } from "./navigation";
import { Navigation2 } from "@/components/navigation2";
import { DottedSeparator } from "./dotted-separator";
import { WorkspaceSwitcher } from "./workspace-switcher";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-[oklch(0.98_0.01_80)] p-4 w-full">
      <Link href="/" className="flex items-center">
        <Image src="/logo-supply-chain-guru/icon-transparent.png" alt="logo" width={40} height={40} />
        <Image src="/logo-supply-chain-guru/logo-horizontal-text.png" alt="logo" width={200} height={200} className="-ml-1 " />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Navigation2 />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
