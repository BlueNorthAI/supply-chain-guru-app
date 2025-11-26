"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, RefreshCw, Maximize2} from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Line, ComposedChart } from "recharts"



// Data for Master Scheduling Summary
const masterSchedulingData = [
  {
    period: "Jan",
    demand: 1200000,
    customerDemand: 1100000,
    mpsSupply: 1150000,
    plannedOrders: 1000000,
    salesOrderPastDue: 50000,
    line: 1180000,
  },
  {
    period: "Feb",
    demand: 800000,
    customerDemand: 750000,
    mpsSupply: 800000,
    plannedOrders: 700000,
    salesOrderPastDue: 30000,
    line: 820000,
  },
  {
    period: "Mar",
    demand: 900000,
    customerDemand: 850000,
    mpsSupply: 900000,
    plannedOrders: 800000,
    salesOrderPastDue: 40000,
    line: 880000,
  },
  {
    period: "Apr",
    demand: 950000,
    customerDemand: 900000,
    mpsSupply: 950000,
    plannedOrders: 850000,
    salesOrderPastDue: 35000,
    line: 920000,
  },
  {
    period: "May",
    demand: 1000000,
    customerDemand: 950000,
    mpsSupply: 1000000,
    plannedOrders: 900000,
    salesOrderPastDue: 45000,
    line: 980000,
  },
]

// Data for Asset Utilization
const assetUtilizationData = [
  { period: "W1", actual: 85, current: 80 },
  { period: "W2", actual: 90, current: 85 },
  { period: "W3", actual: 88, current: 82 },
  { period: "W4", actual: 92, current: 88 },
  { period: "W5", actual: 87, current: 85 },
  { period: "W6", actual: 89, current: 87 },
  { period: "W7", actual: 91, current: 89 },
  { period: "W8", actual: 86, current: 84 },
]

// Data for Demand Change
const demandChangeData = [
  { period: "Jan 2017", previous: 2000000, current: 2100000, pastDue: 50000, cumulative: 0 },
  { period: "Feb 2017", previous: 1800000, current: 1900000, pastDue: 40000, cumulative: -5 },
  { period: "Mar 2017", previous: 2200000, current: 2000000, pastDue: 60000, cumulative: -10 },
  { period: "Apr 2017", previous: 2100000, current: 2300000, pastDue: 45000, cumulative: 5 },
  { period: "May 2017", previous: 1900000, current: 2100000, pastDue: 35000, cumulative: 8 },
]

// Data for Constraints Impacting MPS
const constraintsData = [
  { constraint: "01-C24004 (R3001)", impact: 95 },
  { constraint: "02-C24005 (R3002)", impact: 85 },
  { constraint: "03-C24006 (R3003)", impact: 75 },
  { constraint: "04-C24007 (R3004)", impact: 65 },
]

// Data for Ending Inventory
const endingInventoryData = [
  { period: "Jan", actual: 3500000, current: 3200000 },
  { period: "Feb", actual: 3200000, current: 3000000 },
  { period: "Mar", actual: 3800000, current: 3500000 },
  { period: "Apr", actual: 3600000, current: 3400000 },
  { period: "May", actual: 3400000, current: 3200000 },
  { period: "Jun", actual: 3300000, current: 3100000 },
  { period: "Jul", actual: 3200000, current: 3000000 },
  { period: "Aug", actual: 3100000, current: 2900000 },
]

// Data for Plan Adherence
const planAdherenceData = [
  { period: "Cell Phone", planned: 1000000, actual: 950000, adherence: 95, attainment: 92 },
  { period: "Tablet", planned: 800000, actual: 820000, adherence: 102, attainment: 98 },
  { period: "Laptop", planned: 600000, actual: 580000, adherence: 97, attainment: 94 },
  { period: "System", planned: 400000, actual: 380000, adherence: 95, attainment: 90 },
]

// Data for Component Shortages
const componentShortagesData = [
  { component: "01-C24004 (R3001)", shortage: 90 },
  { component: "02-C24005 (R3002)", shortage: 85 },
  { component: "03-C24006 (R3003)", shortage: 80 },
  { component: "04-C24007 (R3004)", shortage: 75 },
  { component: "05-R24008 (R3005)", shortage: 70 },
]

// Chart configurations
const masterSchedulingConfig = {
  demand: {
    label: "Demand",
    color: "hsl(var(--chart-1))",
  },
  customerDemand: {
    label: "Customer Demand",
    color: "hsl(var(--chart-2))",
  },
  mpsSupply: {
    label: "MPS Supply",
    color: "hsl(var(--chart-3))",
  },
  plannedOrders: {
    label: "Planned Orders",
    color: "hsl(var(--chart-4))",
  },
  salesOrderPastDue: {
    label: "Sales Orders Past Due",
    color: "hsl(var(--chart-5))",
  },
  line: {
    label: "Trend Line",
    color: "#000000",
  },
}

const assetUtilizationConfig = {
  actual: {
    label: "Actual Plan",
    color: "hsl(var(--chart-1))",
  },
  current: {
    label: "Current",
    color: "hsl(var(--chart-2))",
  },
}

const demandChangeConfig = {
  previous: {
    label: "Previous Plan",
    color: "hsl(var(--chart-1))",
  },
  current: {
    label: "Current",
    color: "hsl(var(--chart-2))",
  },
  pastDue: {
    label: "Past Due Change",
    color: "hsl(var(--chart-3))",
  },
  cumulative: {
    label: "Cumulative Change",
    color: "#000000",
  },
}

const constraintsConfig = {
  impact: {
    label: "Quantity of MPS Rows",
    color: "hsl(var(--chart-1))",
  },
}

const endingInventoryConfig = {
  actual: {
    label: "Actual Plan",
    color: "hsl(var(--chart-1))",
  },
  current: {
    label: "Current",
    color: "hsl(var(--chart-2))",
  },
}

const planAdherenceConfig = {
  planned: {
    label: "Planned",
    color: "hsl(var(--chart-1))",
  },
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-2))",
  },
  adherence: {
    label: "Adherence %",
    color: "hsl(var(--chart-3))",
  },
  attainment: {
    label: "Attainment %",
    color: "hsl(var(--chart-4))",
  },
}

const componentShortagesConfig = {
  shortage: {
    label: "Quantity of MPS Rows",
    color: "hsl(var(--chart-1))",
  },
}

const DashboardCard = ({
  title,
  children,
  className = "",
}: { title: string; children: React.ReactNode; className?: string }) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" className="h-4 w-4">
          <RefreshCw className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-4 w-4">
          <Maximize2 className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-4 w-4">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

export default function ManufacturingDashboard() {

  return (
    <div className="w-full space-y-4 p-4">
     
      <h1 className="mt-2 text-2xl font-bold">META VR Manufacturing Dashboard</h1>
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Master Scheduling Summary */}
        <DashboardCard title="Master Scheduling Summary">
          <ChartContainer config={masterSchedulingConfig} className="h-64 w-full">
            <ComposedChart data={masterSchedulingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="demand" fill="var(--color-demand)" />
              <Bar dataKey="customerDemand" fill="var(--color-customerDemand)" />
              <Bar dataKey="mpsSupply" fill="var(--color-mpsSupply)" />
              <Bar dataKey="plannedOrders" fill="var(--color-plannedOrders)" />
              <Bar dataKey="salesOrderPastDue" fill="var(--color-salesOrderPastDue)" />
              <Line type="monotone" dataKey="line" stroke="var(--color-line)" strokeWidth={2} />
            </ComposedChart>
          </ChartContainer>
        </DashboardCard>

        {/* Revenue At Risk Heatmap */}
        <DashboardCard title="Revenue At Risk Heatmap (next 4 periods)">
          <div className="h-64">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs">Group By: Product Group1 • Part Name</span>
              <div className="flex items-center gap-1 ml-auto">
                <div className="w-3 h-3 bg-green-600"></div>
                <span className="text-xs">Total Revenue</span>
                <div className="w-3 h-3 bg-red-600 ml-2"></div>
                <span className="text-xs">Pct% Late Revenue</span>
                <Badge variant="outline" className="text-xs">
                  0.0%
                </Badge>
                <Badge variant="outline" className="text-xs">
                  10.0%
                </Badge>
                <Badge variant="outline" className="text-xs">
                  20.0%
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1 h-48">
              {/* Cell Phone */}
              <div className="bg-green-600 text-white p-2 text-xs">
                <div className="font-medium">Cell Phone</div>
                <div className="grid grid-rows-3 gap-1 mt-1 h-32">
                  <div className="bg-green-500 p-1 text-center">P2000</div>
                  <div className="bg-red-600 p-1 text-center">P1000</div>
                  <div className="bg-green-500 p-1 text-center">P3000</div>
                </div>
              </div>

              {/* Tablet */}
              <div className="bg-green-600 text-white p-2 text-xs">
                <div className="font-medium">Tablet</div>
                <div className="grid grid-rows-3 gap-1 mt-1 h-32">
                  <div className="bg-green-500 p-1 text-center">T2000</div>
                  <div className="bg-green-500 p-1 text-center">T3000</div>
                  <div className="bg-green-500 p-1 text-center">T1100</div>
                </div>
              </div>

              {/* Laptop */}
              <div className="bg-green-600 text-white p-2 text-xs">
                <div className="font-medium">Laptop</div>
                <div className="grid grid-cols-2 grid-rows-4 gap-1 mt-1 h-32">
                  <div className="bg-green-500 p-1 text-center text-xs">L1500-11</div>
                  <div className="bg-green-500 p-1 text-center text-xs">L3500-22</div>
                  <div className="bg-green-500 p-1 text-center text-xs">L3500-3</div>
                  <div className="bg-green-500 p-1 text-center text-xs">L3500-12</div>
                  <div className="bg-green-500 p-1 text-center text-xs">L2500</div>
                  <div className="bg-green-500 p-1 text-center text-xs">L3500-21</div>
                  <div className="bg-green-500 p-1 text-center text-xs">L2500</div>
                </div>
              </div>

              {/* System */}
              <div className="bg-green-600 text-white p-2 text-xs">
                <div className="font-medium">System</div>
                <div className="grid grid-rows-3 gap-1 mt-1 h-32">
                  <div className="bg-green-500 p-1 text-center">S8000X</div>
                  <div className="bg-green-500 p-1 text-center">S8000X</div>
                  <div className="bg-green-500 p-1 text-center">S7000X</div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Orders Past Due Heatmap */}
        <DashboardCard title="Orders Past Due Heatmap">
          <div className="h-48">
            <div className="text-xs mb-2">Group By: Product Group1 • Weeks Past Due</div>
            <div className="grid grid-cols-2 grid-rows-2 gap-1 h-40">
              <div className="bg-yellow-400 text-black p-2 text-xs flex flex-col justify-center items-center">
                <div className="font-medium">Cell Phone</div>
                <div className="text-lg font-bold">3 Wks</div>
              </div>
              <div className="bg-orange-400 text-white p-2 text-xs flex flex-col justify-center items-center">
                <div className="font-medium">Tablet</div>
                <div className="text-lg font-bold">1 Wks</div>
              </div>
              <div className="bg-orange-500 text-white p-2 text-xs flex flex-col justify-center items-center">
                <div className="font-medium">2 Wks</div>
              </div>
              <div className="bg-red-600 text-white p-2 text-xs flex flex-col justify-center items-center">
                <div className="font-medium">1+ Wks</div>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Asset Utilization */}
        <DashboardCard title="Asset Utilization (key constraints)">
          <ChartContainer config={assetUtilizationConfig} className="h-48 w-full">
            <BarChart data={assetUtilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="actual" fill="var(--color-actual)" />
              <Bar dataKey="current" fill="var(--color-current)" />
            </BarChart>
          </ChartContainer>
        </DashboardCard>

        {/* Demand Change */}
        <DashboardCard title="Demand Change (lag 0 vs lag 1)">
          <ChartContainer config={demandChangeConfig} className="h-48 w-full">
            <ComposedChart data={demandChangeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="previous" fill="var(--color-previous)" />
              <Bar dataKey="current" fill="var(--color-current)" />
              <Bar dataKey="pastDue" fill="var(--color-pastDue)" />
              <Line type="monotone" dataKey="cumulative" stroke="var(--color-cumulative)" />
            </ComposedChart>
          </ChartContainer>
        </DashboardCard>

        {/* Constraints Impacting MPS */}
        <DashboardCard title="Constraints Impacting MPS">
          <ChartContainer config={constraintsConfig} className="h-48 w-full">
            <BarChart data={constraintsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="constraint" type="category" width={80} fontSize={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="impact" fill="var(--color-impact)" />
            </BarChart>
          </ChartContainer>
        </DashboardCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ending Inventory */}
        <DashboardCard title="Ending Inventory">
          <ChartContainer config={endingInventoryConfig} className="h-48 w-full">
            <BarChart data={endingInventoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: unknown) => {
                      const num = typeof value === "number" ? value : Number(value)
                      if (isNaN(num)) return [String(value), ""]
                      return [`$${(num / 1000000).toFixed(1)}M`, ""]
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="actual" fill="var(--color-actual)" />
              <Bar dataKey="current" fill="var(--color-current)" />
            </BarChart>
          </ChartContainer>
        </DashboardCard>

        {/* Plan Adherence */}
        <DashboardCard title="Plan Adherence">
          <ChartContainer config={planAdherenceConfig} className="h-48 w-full">
            <ComposedChart data={planAdherenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="planned" fill="var(--color-planned)" />
              <Bar dataKey="actual" fill="var(--color-actual)" />
              <Line type="monotone" dataKey="adherence" stroke="var(--color-adherence)" />
              <Line type="monotone" dataKey="attainment" stroke="var(--color-attainment)" />
            </ComposedChart>
          </ChartContainer>
        </DashboardCard>

        {/* Component Shortages Impacting MPS */}
        <DashboardCard title="Component Shortages Impacting MPS">
          <ChartContainer config={componentShortagesConfig} className="h-48 w-full">
            <BarChart data={componentShortagesData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="component" type="category" width={100} fontSize={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="shortage" fill="var(--color-shortage)" />
            </BarChart>
          </ChartContainer>
        </DashboardCard>
      </div>
    </div>
  )
}
