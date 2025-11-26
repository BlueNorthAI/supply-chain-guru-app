"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoServer, GoNorthStar } from "react-icons/go";
import { MdOutlineWarehouse } from "react-icons/md";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { LiaBroadcastTowerSolid } from "react-icons/lia";
import { cn } from "@/lib/utils";

const routes = [

      {
      label: "Control Tower",
      href: "/control",
      icon: LiaBroadcastTowerSolid,
      activeIcon: LiaBroadcastTowerSolid,
  },

  {
    label: "Operations Metrics",
    href: "/warehouse",
    icon: MdOutlineWarehouse,
    activeIcon: MdOutlineWarehouse,
  },

  {
    label: "Track & Trace",
    href: "/track",
    icon: GoServer,
    activeIcon: GoServer,
  },
 
 
 {
    label: "Demand Balancing",
    href: "/controlKpi/demand-balancing",
      icon: GoNorthStar,
    activeIcon: GoNorthStar,
  },
  {
    label: "Inventory Projections",
    href: "/controlKpi/finishGoods",
      icon: GoNorthStar,
    activeIcon: GoNorthStar,
  },
  {
    label: "Order Fulfillment",
    href: "/controlKpi/custReceipt",
      icon: GoNorthStar,
    activeIcon: GoNorthStar,
  },
  // {
  //   label: "Operations Metrics2",
  //   href: "/operation",
  //   icon: MdOutlineWarehouse,
  //   activeIcon: MdOutlineWarehouse,
  // },
  // {
  //   label: "Cost Analytics",
  //   href: "/costAnalysis",
  //   icon: AiOutlineDollarCircle,
  //   activeIcon: AiOutlineDollarCircle,
  // },
//  {
//     label: "Benchmarking",
//     href: "/benchmark",
//     icon: GoNorthStar,
//     activeIcon: GoNorthStar,
//   },
  //   {
  //   label: "Incidents",
  //   href: "/incidents",
  //   icon: GoServer,
  //   activeIcon: GoServer,
  // },
  // {
  //   label: "My Tasks",
  //   href: "/tasks",
  //   icon: GoCheckCircle,
  //   activeIcon: GoCheckCircleFill,
  // },

  // {
  //   label: "Settings",
  //   href: "/settings",
  //   icon: SettingsIcon,
  //   activeIcon: SettingsIcon,
  // },
  // {
  //   label: "Members",
  //   href: "/members",
  //   icon: UsersIcon,
  //   activeIcon: UsersIcon,
  // },

];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const fullHref = `/workspaces/${workspaceId}${item.href}`
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;
        
        return (
          <Link key={item.href} href={fullHref}>
            <div className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
              isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
            )}>
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        )
      })}
    </ul>
  );
};
