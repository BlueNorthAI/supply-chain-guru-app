"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ManufacturingDashboard from "./Dashboard"
import AssetUtilization from "./Assets"
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
    <Tabs defaultValue="inv-level">
        
      <TabsList>
      <TabsTrigger value="inv-level">Asset Utilization</TabsTrigger>
        <TabsTrigger value="lead-time">Manufacturing Dashboard</TabsTrigger>
 
      </TabsList>
      <TabsContent value="inv-level">
        <AssetUtilization />
      </TabsContent>

      <TabsContent value="lead-time">
        <ManufacturingDashboard />
      </TabsContent>
    </Tabs>
    </div>
  )
}