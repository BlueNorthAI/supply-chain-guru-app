"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LeadTimeTable from "./leadTime"
import InventoryLevel from "./InvLevel"
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
    <Tabs defaultValue="lead-time">
        
      <TabsList>
        
        <TabsTrigger value="lead-time">RM Coverage</TabsTrigger>
        <TabsTrigger value="inv-level">RM Alerts</TabsTrigger>
      </TabsList>
      <TabsContent value="lead-time">
        <LeadTimeTable />
      </TabsContent>

      <TabsContent value="inv-level">
        <InventoryLevel />
      </TabsContent>
    </Tabs>
    </div>
  )
}