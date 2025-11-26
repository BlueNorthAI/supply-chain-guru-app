"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InventoryItem {
  id: number
  gatingItem: string
  supplysite: string
  partClass: string
  responsible: string
  stockInOtherSites: boolean
  alternateSources: number
  availableSubstitutes: number
  orders: number
  orderDueDateFirst: string
  orderDueDateLast: string
  shortage: number
  revenue: string
  margin: string
  isHighlighted?: boolean
}

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    gatingItem: "D3701",
    supplysite: "E3002",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 2,
    orderDueDateFirst: "07-31-17",
    orderDueDateLast: "07-31-17",
    shortage: 21847,
    revenue: "$6,629,972",
    margin: "$531,283",
    isHighlighted: true,
  },
  {
    id: 2,
    gatingItem: "",
    supplysite: "P1001",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 2,
    orderDueDateFirst: "07-31-17",
    orderDueDateLast: "07-31-17",
    shortage: 21847,
    revenue: "$6,629,972",
    margin: "$531,283",
    isHighlighted: true,
  },
  {
    id: 3,
    gatingItem: "D3712",
    supplysite: "E3002",
    partClass: "Raw Material",
    responsible: "Master Administrator",
    stockInOtherSites: false,
    alternateSources: 2,
    availableSubstitutes: 0,
    orders: 2,
    orderDueDateFirst: "07-31-17",
    orderDueDateLast: "07-31-17",
    shortage: 1618,
    revenue: "$6,629,972",
    margin: "$531,283",
    isHighlighted: true,
  },
  {
    id: 4,
    gatingItem: "P3000",
    supplysite: "C1001",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 2,
    orderDueDateFirst: "07-31-17",
    orderDueDateLast: "07-31-17",
    shortage: 21847,
    revenue: "$6,629,972",
    margin: "$531,283",
    isHighlighted: true,
  },
  {
    id: 5,
    gatingItem: "",
    supplysite: "P1001",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 2,
    orderDueDateFirst: "07-31-17",
    orderDueDateLast: "07-31-17",
    shortage: 21847,
    revenue: "$6,629,972",
    margin: "$531,283",
    isHighlighted: true,
  },
  {
    id: 6,
    gatingItem: "",
    supplysite: "R1001",
    partClass: "Finished Goods",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-31-17",
    orderDueDateLast: "07-31-17",
    shortage: 17511,
    revenue: "$5,099,287",
    margin: "$408,624",
    isHighlighted: true,
  },
  {
    id: 7,
    gatingItem: "",
    supplysite: "R1003",
    partClass: "Finished Goods",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-31-17",
    orderDueDateLast: "07-31-17",
    shortage: 4336,
    revenue: "$1,530,685",
    margin: "$122,659",
    isHighlighted: true,
  },
  {
    id: 8,
    gatingItem: "B1001",
    supplysite: "E3001",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 9,
    gatingItem: "",
    supplysite: "P1001",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 10,
    gatingItem: "B1011",
    supplysite: "E3001",
    partClass: "Raw Material",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 11,
    gatingItem: "C1001",
    supplysite: "P1001",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 12,
    gatingItem: "C1010",
    supplysite: "P1001",
    partClass: "Raw Material",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 13,
    gatingItem: "C1011",
    supplysite: "P1001",
    partClass: "Raw Material",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 14,
    gatingItem: "C1012",
    supplysite: "P1001",
    partClass: "Raw Material",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 15,
    gatingItem: "D1001",
    supplysite: "E3002",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 16,
    gatingItem: "",
    supplysite: "P1001",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 17,
    gatingItem: "D1010",
    supplysite: "E3002",
    partClass: "Raw Material",
    responsible: "Master Administrator",
    stockInOtherSites: false,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 18,
    gatingItem: "D1011",
    supplysite: "E3002",
    partClass: "Raw Material",
    responsible: "Master Administrator",
    stockInOtherSites: false,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 19,
    gatingItem: "D1012",
    supplysite: "E3002",
    partClass: "Raw Material",
    responsible: "Master Administrator",
    stockInOtherSites: false,
    alternateSources: 2,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 353,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 20,
    gatingItem: "D2501",
    supplysite: "E3002",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 16,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 303666,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 21,
    gatingItem: "",
    supplysite: "P1002",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 8,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 144143,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 22,
    gatingItem: "",
    supplysite: "P2001",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 8,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 159621,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 23,
    gatingItem: "D2512",
    supplysite: "E3002",
    partClass: "Raw Material",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 2,
    availableSubstitutes: 0,
    orders: 24,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 253972,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 24,
    gatingItem: "I2500-11",
    supplysite: "C1001",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 2,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 25920,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 25,
    gatingItem: "",
    supplysite: "C2001",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 2,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 36744,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 26,
    gatingItem: "",
    supplysite: "P1002",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 2,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 25818,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 27,
    gatingItem: "",
    supplysite: "P2001",
    partClass: "Work In Progress",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 2,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 36648,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 28,
    gatingItem: "",
    supplysite: "R1001",
    partClass: "Finished Goods",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 21049,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
  {
    id: 29,
    gatingItem: "",
    supplysite: "R1003",
    partClass: "Finished Goods",
    responsible: "Master Administrator",
    stockInOtherSites: true,
    alternateSources: 1,
    availableSubstitutes: 0,
    orders: 1,
    orderDueDateFirst: "07-03-17",
    orderDueDateLast: "07-03-17",
    shortage: 5176,
    revenue: "$0",
    margin: "$0",
    isHighlighted: true,
  },
]

export default function InventoryDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = inventoryData.filter(
    (item) =>
      item.gatingItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplysite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partClass.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate summary metrics
  const totalShortage = inventoryData.reduce((sum, item) => sum + item.shortage, 0)
  const totalRevenue = inventoryData
    .reduce((sum, item) => {
      const value = item.revenue.replace("$", "").replace(",", "")
      return sum + (Number.parseFloat(value) || 0)
    }, 0)
    .toLocaleString()
  const totalMargin = inventoryData
    .reduce((sum, item) => {
      const value = item.margin.replace("$", "").replace(",", "")
      return sum + (Number.parseFloat(value) || 0)
    }, 0)
    .toLocaleString()

  const getPartClassBadge = (partClass: string) => {
    switch (partClass) {
      case "Work In Progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            {partClass}
          </Badge>
        )
      case "Raw Material":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            {partClass}
          </Badge>
        )
      case "Finished Goods":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
            {partClass}
          </Badge>
        )
      default:
        return <Badge variant="outline">{partClass}</Badge>
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Raw Material Alerts</h1>
          <p className="text-muted-foreground">Supply chain and inventory management overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              className="pl-8 w-[200px] md:w-[260px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Shortage</p>
                <p className="text-2xl font-bold">{totalShortage.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue Impact</p>
                <p className="text-2xl font-bold">${totalRevenue}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Margin Impact</p>
                <p className="text-2xl font-bold">${totalMargin}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Levers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="font-medium min-w-[120px]">Gating Item</TableHead>
                  <TableHead className="min-w-[100px]">Supply Site</TableHead>
                  <TableHead className="min-w-[140px]">Part Class</TableHead>
                  <TableHead className="min-w-[140px]">Responsible</TableHead>
                  <TableHead className="min-w-[100px] text-center">Stock in Other Sites</TableHead>
                  <TableHead className="min-w-[100px] text-center">Alternate Sources</TableHead>
                  <TableHead className="min-w-[100px] text-center">Available Substitutes</TableHead>
                  <TableHead className="min-w-[80px] text-center">Orders</TableHead>
                  <TableHead className="min-w-[100px] text-center">Order Due Date First</TableHead>
                  <TableHead className="min-w-[100px] text-center">Order Due Date Last</TableHead>
                  <TableHead className="min-w-[100px] text-right">Shortage</TableHead>
                  <TableHead className="min-w-[120px] text-right">Revenue</TableHead>
                  <TableHead className="min-w-[120px] text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className={item.isHighlighted ? "bg-yellow-50" : ""}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">
                      {item.gatingItem ? (
                        <a href="#" className="text-primary hover:underline">
                          {item.gatingItem}
                        </a>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>{item.supplysite}</TableCell>
                    <TableCell>{getPartClassBadge(item.partClass)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600">👤</span>
                        {item.responsible}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.stockInOtherSites ? (
                        <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">
                          Yes
                        </Badge>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell className="text-center">{item.alternateSources}</TableCell>
                    <TableCell className="text-center">{item.availableSubstitutes}</TableCell>
                    <TableCell className="text-center">{item.orders}</TableCell>
                    <TableCell className="text-center">{item.orderDueDateFirst}</TableCell>
                    <TableCell className="text-center">{item.orderDueDateLast}</TableCell>
                    <TableCell className="text-right font-medium">{item.shortage.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.revenue}</TableCell>
                    <TableCell className="text-right">{item.margin}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
