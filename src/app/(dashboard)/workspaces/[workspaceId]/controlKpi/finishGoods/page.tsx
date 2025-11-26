"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MetaVRFinishedGoodsTable from "@/app/(dashboard)/workspaces/[workspaceId]/controlKpi/finished-goods/page"
import MetaVRAgingDashboard from "@/components/controlKpi/meta-vr-aging-dashboard"

import InvProj from "@/app/(dashboard)/workspaces/[workspaceId]/controlKpi/invProj/page"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"


export default function RawMaterial() {
  const params = useParams()
  const workspaceId = params.workspaceId as string
  return (
    <div className="w-full space-y-6">
    <Link href={`/workspaces/${workspaceId}/controlKpi/supplyChain`}>
    <Button variant="ghost" size="sm">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Supply Chain Control Tower
    </Button>
  </Link>
    <Tabs defaultValue="inv-projection">
        
      <TabsList>
      <TabsTrigger value="inv-projection">Inventory Projection</TabsTrigger>
        <TabsTrigger value="finished-goods">Finished Goods</TabsTrigger>
        <TabsTrigger value="aging-dashboard">Aging Dashboard</TabsTrigger>
       
      </TabsList> <TabsContent value="inv-projection">
        <InvProj />
      </TabsContent>
      <TabsContent value="finished-goods">
        <MetaVRFinishedGoodsTable />
      </TabsContent>

      <TabsContent value="aging-dashboard">
        <MetaVRAgingDashboard />
      </TabsContent>

     
    </Tabs>
    </div>
  )
}