"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MetaVRFinishedGoodsTable from "@/components/controlKpi/meta-vr-finished-goods-table"
import MetaVRReturnsRMATable from "@/components/controlKpi/meta-vr-returns-rma-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"


export default function RawMaterial() {
  const params = useParams()
  const workspaceId = params.workspaceId as string
  return (
    <div className="w-full space-y-4">
    <Link href={`/workspaces/${workspaceId}/controlKpi/supplyChain`}>
    <Button variant="ghost" size="sm">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Supply Chain Control Tower
    </Button>
  </Link>
    <Tabs defaultValue="lead-time">
        
      <TabsList>
        
        <TabsTrigger value="lead-time">Finished Goods</TabsTrigger>
        <TabsTrigger value="inv-level">Returns/RMA</TabsTrigger>
      </TabsList>
      <TabsContent value="lead-time">
        <MetaVRFinishedGoodsTable />
      </TabsContent>

      <TabsContent value="inv-level">
        <MetaVRReturnsRMATable />
      </TabsContent>
    </Tabs>
    </div>
  )
}