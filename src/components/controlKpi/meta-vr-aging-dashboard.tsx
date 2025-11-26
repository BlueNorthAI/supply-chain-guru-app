"use client"

import React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Download,
  Filter,
  MoreHorizontal,
  Package,
  Search,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define interfaces for our data
interface VRInventoryAgingItem {
  id: string
  sku: string
  description: string
  category: string
  location: string
  quantity: number
  unitCost: number
  totalValue: number
  daysInInventory: number
  agingBucket: string
  turnoverRate: number
  lastMovementDate: string
  launchDate: string
  nextGenReleaseDate?: string
  recommendations: VRRecommendation[]
  kpis: VRKPI[]
  riskLevel: "low" | "medium" | "high" | "critical"
  techObsolescenceRisk: "low" | "medium" | "high"
}

interface VRRecommendation {
  id: string
  type: string
  action: string
  impact: string
  priority: "low" | "medium" | "high"
  potentialSavings?: number
  timeframe: string
}

interface VRKPI {
  name: string
  value: string | number
  trend: "up" | "down" | "neutral"
  target?: string | number
  unit?: string
}

// Sample Meta VR inventory aging data
const metaVRInventoryData: VRInventoryAgingItem[] = [
  {
    id: "VR-1001",
    sku: "META-QUEST2-128GB",
    description: "Meta Quest 2 VR Headset 128GB",
    category: "VR Headsets",
    location: "Warehouse North America",
    quantity: 245,
    unitCost: 199.99,
    totalValue: 48997.55,
    daysInInventory: 195,
    agingBucket: "180+ days",
    turnoverRate: 0.6,
    lastMovementDate: "2024-11-20",
    launchDate: "2020-10-13",
    nextGenReleaseDate: "2024-10-15",
    recommendations: [
      {
        id: "rec-vr1001-1",
        type: "Clearance Sale",
        action: "Apply 25% discount for Quest 2 clearance before Quest 3S launch",
        impact: "Move 70% of inventory within 45 days before new model cannibalization",
        priority: "high",
        potentialSavings: 12249.39,
        timeframe: "30-45 days",
      },
      {
        id: "rec-vr1001-2",
        type: "Bundle Strategy",
        action: "Create Quest 2 starter bundles with Elite Strap and carrying case",
        impact: "Increase perceived value while clearing aging Quest 2 inventory",
        priority: "high",
        potentialSavings: 9799.51,
        timeframe: "60 days",
      },
      {
        id: "rec-vr1001-3",
        type: "B2B Sales",
        action: "Target enterprise/education markets for bulk Quest 2 sales",
        impact: "Leverage lower price point for institutional buyers",
        priority: "medium",
        timeframe: "90 days",
      },
      {
        id: "rec-vr1001-4",
        type: "Trade-in Program",
        action: "Launch Quest 2 trade-in program for Quest 3 upgrades",
        impact: "Drive Quest 3 sales while clearing Quest 2 inventory",
        priority: "medium",
        potentialSavings: 7349.63,
        timeframe: "120 days",
      },
    ],
    kpis: [
      { name: "Holding Cost", value: "$12,249", trend: "up", unit: "USD" },
      { name: "Days of Supply", value: 195, trend: "up", target: 45, unit: "days" },
      { name: "Turnover Rate", value: 0.6, trend: "down", target: 4.0 },
      { name: "Tech Obsolescence Risk", value: "High", trend: "up" },
      { name: "Margin Erosion", value: "-22%", trend: "down" },
    ],
    riskLevel: "critical",
    techObsolescenceRisk: "high",
  },
  {
    id: "VR-1002",
    sku: "META-QUEST2-256GB",
    description: "Meta Quest 2 VR Headset 256GB",
    category: "VR Headsets",
    location: "Warehouse Europe",
    quantity: 156,
    unitCost: 299.99,
    totalValue: 46798.44,
    daysInInventory: 187,
    agingBucket: "180+ days",
    turnoverRate: 0.7,
    lastMovementDate: "2024-12-01",
    launchDate: "2020-10-13",
    nextGenReleaseDate: "2024-10-15",
    recommendations: [
      {
        id: "rec-vr1002-1",
        type: "Premium Bundle",
        action: "Create premium Quest 2 bundles with Link Cable and Pro accessories",
        impact: "Position as premium entry-level option vs Quest 3",
        priority: "high",
        potentialSavings: 9359.69,
        timeframe: "45 days",
      },
      {
        id: "rec-vr1002-2",
        type: "Regional Discount",
        action: "Apply region-specific discounts in slower-moving markets",
        impact: "Optimize pricing by region to accelerate movement",
        priority: "medium",
        timeframe: "60 days",
      },
    ],
    kpis: [
      { name: "Holding Cost", value: "$11,699", trend: "up", unit: "USD" },
      { name: "Days of Supply", value: 187, trend: "up", target: 45, unit: "days" },
      { name: "Turnover Rate", value: 0.7, trend: "down", target: 4.0 },
      { name: "Tech Obsolescence Risk", value: "High", trend: "up" },
      { name: "Margin Erosion", value: "-20%", trend: "down" },
    ],
    riskLevel: "critical",
    techObsolescenceRisk: "high",
  },
  {
    id: "VR-1003",
    sku: "META-QUEST3-128GB",
    description: "Meta Quest 3 VR Headset 128GB",
    category: "VR Headsets",
    location: "Warehouse North America",
    quantity: 89,
    unitCost: 399.99,
    totalValue: 35599.11,
    daysInInventory: 125,
    agingBucket: "121-180 days",
    turnoverRate: 1.4,
    lastMovementDate: "2025-01-15",
    launchDate: "2023-10-10",
    recommendations: [
      {
        id: "rec-vr1003-1",
        type: "Holiday Promotion",
        action: "Position Quest 3 as premium holiday gift with accessories bundle",
        impact: "Leverage holiday season to move current-gen inventory",
        priority: "medium",
        timeframe: "30 days",
      },
      {
        id: "rec-vr1003-2",
        type: "Gaming Bundle",
        action: "Create gaming bundles with popular VR titles and accessories",
        impact: "Increase value proposition for gaming enthusiasts",
        priority: "medium",
        timeframe: "45 days",
      },
    ],
    kpis: [
      { name: "Holding Cost", value: "$4,450", trend: "up", unit: "USD" },
      { name: "Days of Supply", value: 125, trend: "up", target: 60, unit: "days" },
      { name: "Turnover Rate", value: 1.4, trend: "down", target: 3.0 },
      { name: "Tech Obsolescence Risk", value: "Medium", trend: "neutral" },
      { name: "Margin Impact", value: "-8%", trend: "down" },
    ],
    riskLevel: "medium",
    techObsolescenceRisk: "medium",
  },
  {
    id: "VR-1004",
    sku: "META-QUEST3-512GB",
    description: "Meta Quest 3 VR Headset 512GB",
    category: "VR Headsets",
    location: "Warehouse Asia Pacific",
    quantity: 67,
    unitCost: 499.99,
    totalValue: 33499.33,
    daysInInventory: 98,
    agingBucket: "91-120 days",
    turnoverRate: 1.8,
    lastMovementDate: "2025-02-10",
    launchDate: "2023-10-10",
    recommendations: [
      {
        id: "rec-vr1004-1",
        type: "Premium Positioning",
        action: "Market as premium VR solution for content creators and professionals",
        impact: "Target high-value customer segments",
        priority: "medium",
        timeframe: "60 days",
      },
      {
        id: "rec-vr1004-2",
        type: "Developer Program",
        action: "Offer discounts to VR developers and content creators",
        impact: "Build ecosystem while moving premium inventory",
        priority: "low",
        timeframe: "90 days",
      },
    ],
    kpis: [
      { name: "Holding Cost", value: "$3,283", trend: "up", unit: "USD" },
      { name: "Days of Supply", value: 98, trend: "up", target: 60, unit: "days" },
      { name: "Turnover Rate", value: 1.8, trend: "neutral", target: 3.0 },
      { name: "Tech Obsolescence Risk", value: "Low", trend: "neutral" },
      { name: "Margin Impact", value: "-3%", trend: "neutral" },
    ],
    riskLevel: "medium",
    techObsolescenceRisk: "low",
  },
  {
    id: "VR-1005",
    sku: "META-QUESTPRO",
    description: "Meta Quest Pro VR Headset",
    category: "VR Headsets",
    location: "Warehouse North America",
    quantity: 34,
    unitCost: 999.99,
    totalValue: 33999.66,
    daysInInventory: 220,
    agingBucket: "180+ days",
    turnoverRate: 0.4,
    lastMovementDate: "2024-10-15",
    launchDate: "2022-10-25",
    recommendations: [
      {
        id: "rec-vr1005-1",
        type: "Enterprise Focus",
        action: "Pivot to enterprise and professional markets with B2B pricing",
        impact: "Target businesses needing high-end VR for training/collaboration",
        priority: "high",
        potentialSavings: 10199.9,
        timeframe: "90 days",
      },
      {
        id: "rec-vr1005-2",
        type: "Deep Discount",
        action: "Apply 40% discount to move Quest Pro inventory",
        impact: "Aggressive pricing to clear high-value aging inventory",
        priority: "high",
        potentialSavings: 13599.86,
        timeframe: "60 days",
      },
      {
        id: "rec-vr1005-3",
        type: "Developer Incentive",
        action: "Offer Quest Pro units to VR developers at cost",
        impact: "Build developer ecosystem while clearing inventory",
        priority: "medium",
        timeframe: "120 days",
      },
    ],
    kpis: [
      { name: "Holding Cost", value: "$7,480", trend: "up", unit: "USD" },
      { name: "Days of Supply", value: 220, trend: "up", target: 90, unit: "days" },
      { name: "Turnover Rate", value: 0.4, trend: "down", target: 2.0 },
      { name: "Tech Obsolescence Risk", value: "High", trend: "up" },
      { name: "Margin Erosion", value: "-35%", trend: "down" },
    ],
    riskLevel: "critical",
    techObsolescenceRisk: "high",
  },
  {
    id: "VR-2001",
    sku: "META-ELITE-STRAP",
    description: "Meta Quest Elite Strap",
    category: "VR Accessories",
    location: "Warehouse North America",
    quantity: 312,
    unitCost: 49.99,
    totalValue: 15596.88,
    daysInInventory: 165,
    agingBucket: "121-180 days",
    turnoverRate: 1.2,
    lastMovementDate: "2024-12-20",
    launchDate: "2020-10-13",
    recommendations: [
      {
        id: "rec-vr2001-1",
        type: "Bundle Inclusion",
        action: "Include Elite Strap in Quest 2 and Quest 3 bundles at reduced margin",
        impact: "Move accessory inventory while enhancing headset value proposition",
        priority: "high",
        timeframe: "45 days",
      },
      {
        id: "rec-vr2001-2",
        type: "Comfort Upgrade Campaign",
        action: "Market as essential comfort upgrade for existing Quest users",
        impact: "Target installed base for accessory sales",
        priority: "medium",
        timeframe: "60 days",
      },
    ],
    kpis: [
      { name: "Holding Cost", value: "$1,716", trend: "up", unit: "USD" },
      { name: "Days of Supply", value: 165, trend: "up", target: 90, unit: "days" },
      { name: "Turnover Rate", value: 1.2, trend: "down", target: 6.0 },
      { name: "Attach Rate", value: "15%", trend: "down", target: "35%" },
    ],
    riskLevel: "medium",
    techObsolescenceRisk: "low",
  },
  {
    id: "VR-2002",
    sku: "META-LINK-CABLE",
    description: "Meta Quest Link Cable",
    category: "VR Accessories",
    location: "Warehouse Europe",
    quantity: 189,
    unitCost: 79.99,
    totalValue: 15118.11,
    daysInInventory: 145,
    agingBucket: "121-180 days",
    turnoverRate: 1.6,
    lastMovementDate: "2025-01-05",
    launchDate: "2020-10-13",
    recommendations: [
      {
        id: "rec-vr2002-1",
        type: "PC Gaming Bundle",
        action: "Bundle Link Cable with Quest headsets for PC VR gaming",
        impact: "Target PC gamers wanting wired VR experience",
        priority: "medium",
        timeframe: "60 days",
      },
      {
        id: "rec-vr2002-2",
        type: "Professional Use Case",
        action: "Market to developers and professionals needing stable connection",
        impact: "Position as professional tool for development and enterprise use",
        priority: "low",
        timeframe: "90 days",
      },
    ],
    kpis: [
      { name: "Holding Cost", value: "$1,663", trend: "up", unit: "USD" },
      { name: "Days of Supply", value: 145, trend: "up", target: 75, unit: "days" },
      { name: "Turnover Rate", value: 1.6, trend: "down", target: 4.0 },
      { name: "Attach Rate", value: "12%", trend: "down", target: "25%" },
    ],
    riskLevel: "medium",
    techObsolescenceRisk: "medium",
  },
  {
    id: "VR-2003",
    sku: "META-CARRYING-CASE",
    description: "Meta Quest Carrying Case",
    category: "VR Accessories",
    location: "Warehouse Asia Pacific",
    quantity: 267,
    unitCost: 39.99,
    totalValue: 10677.33,
    daysInInventory: 112,
    agingBucket: "91-120 days",
    turnoverRate: 2.1,
    lastMovementDate: "2025-02-28",
    launchDate: "2020-10-13",
    recommendations: [
      {
        id: "rec-vr2003-1",
        type: "Travel Bundle",
        action: "Create travel bundles with carrying case for mobile VR users",
        impact: "Target users who want portable VR solutions",
        priority: "medium",
        timeframe: "45 days",
      },
      {
        id: "rec-vr2003-2",
        type: "Gift Bundle",
        action: "Include in gift bundles as value-add accessory",
        impact: "Enhance gift appeal while moving accessory inventory",
        priority: "low",
        timeframe: "60 days",
      },
    ],
    kpis: [
      { name: "Holding Cost", value: "$1,068", trend: "up", unit: "USD" },
      { name: "Days of Supply", value: 112, trend: "up", target: 60, unit: "days" },
      { name: "Turnover Rate", value: 2.1, trend: "neutral", target: 6.0 },
      { name: "Attach Rate", value: "18%", trend: "neutral", target: "30%" },
    ],
    riskLevel: "low",
    techObsolescenceRisk: "low",
  },
  {
    id: "VR-3001",
    sku: "META-TOUCH-CONTROLLERS",
    description: "Meta Quest Touch Controllers (Pair)",
    category: "VR Controllers",
    location: "Warehouse North America",
    quantity: 78,
    unitCost: 129.99,
    totalValue: 10139.22,
    daysInInventory: 89,
    agingBucket: "61-90 days",
    turnoverRate: 2.8,
    lastMovementDate: "2025-03-15",
    launchDate: "2023-10-10",
    recommendations: [
      {
        id: "rec-vr3001-1",
        type: "Replacement Market",
        action: "Target existing Quest users needing controller replacements",
        impact: "Serve replacement and upgrade market for installed base",
        priority: "medium",
        timeframe: "60 days",
      },
      {
        id: "rec-vr3001-2",
        type: "Multi-User Setup",
        action: "Market additional controllers for family/multi-user setups",
        impact: "Expand use cases for households with multiple VR users",
        priority: "low",
        timeframe: "90 days",
      },
    ],
    kpis: [
      { name: "Holding Cost", value: "$901", trend: "up", unit: "USD" },
      { name: "Days of Supply", value: 89, trend: "up", target: 45, unit: "days" },
      { name: "Turnover Rate", value: 2.8, trend: "neutral", target: 4.0 },
      { name: "Replacement Rate", value: "8%", trend: "neutral", target: "12%" },
    ],
    riskLevel: "low",
    techObsolescenceRisk: "low",
  },
  {
    id: "VR-4001",
    sku: "META-VR-CONTENT-BUNDLE",
    description: "Meta VR Content Bundle (Digital)",
    category: "VR Software",
    location: "Digital Distribution",
    quantity: 1500,
    unitCost: 29.99,
    totalValue: 44985.0,
    daysInInventory: 75,
    agingBucket: "61-90 days",
    turnoverRate: 3.2,
    lastMovementDate: "2025-03-20",
    launchDate: "2023-06-15",
    recommendations: [
      {
        id: "rec-vr4001-1",
        type: "Hardware Bundle",
        action: "Include content bundle with hardware purchases at reduced cost",
        impact: "Increase hardware value proposition while moving digital inventory",
        priority: "high",
        timeframe: "30 days",
      },
      {
        id: "rec-vr4001-2",
        type: "Seasonal Promotion",
        action: "Offer content bundle discounts during low hardware sales periods",
        impact: "Maintain engagement during hardware inventory transitions",
        priority: "medium",
        timeframe: "45 days",
      },
    ],
    kpis: [
      { name: "Holding Cost", value: "$3,374", trend: "up", unit: "USD" },
      { name: "Days of Supply", value: 75, trend: "up", target: 30, unit: "days" },
      { name: "Turnover Rate", value: 3.2, trend: "neutral", target: 8.0 },
      { name: "Attach Rate", value: "22%", trend: "down", target: "45%" },
    ],
    riskLevel: "low",
    techObsolescenceRisk: "low",
  },
]

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Helper function to get risk level badge
const getRiskBadge = (riskLevel: string) => {
  switch (riskLevel) {
    case "low":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
          Low Risk
        </Badge>
      )
    case "medium":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          Medium Risk
        </Badge>
      )
    case "high":
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
          High Risk
        </Badge>
      )
    case "critical":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
          Critical Risk
        </Badge>
      )
    default:
      return <Badge variant="outline">{riskLevel}</Badge>
  }
}

// Helper function to get tech obsolescence badge
const getTechObsolescenceBadge = (risk: string) => {
  switch (risk) {
    case "low":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
          <Zap className="h-3 w-3 mr-1" />
          Low Tech Risk
        </Badge>
      )
    case "medium":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Zap className="h-3 w-3 mr-1" />
          Medium Tech Risk
        </Badge>
      )
    case "high":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
          <Zap className="h-3 w-3 mr-1" />
          High Tech Risk
        </Badge>
      )
    default:
      return <Badge variant="outline">{risk}</Badge>
  }
}

// Helper function to get trend icon
const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-red-500" />
    case "down":
      return <TrendingDown className="h-4 w-4 text-green-500" />
    case "neutral":
      return <ArrowUpDown className="h-4 w-4 text-gray-500" />
    default:
      return null
  }
}

// Helper function to get recommendation priority badge
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "low":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
          Low Priority
        </Badge>
      )
    case "medium":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          Medium Priority
        </Badge>
      )
    case "high":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
          High Priority
        </Badge>
      )
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

// Helper function to get aging bucket color
const getAgingBucketColor = (bucket: string): string => {
  switch (bucket) {
    case "0-30 days":
      return "bg-green-100"
    case "31-60 days":
      return "bg-green-50"
    case "61-90 days":
      return "bg-yellow-50"
    case "91-120 days":
      return "bg-yellow-100"
    case "121-180 days":
      return "bg-orange-100"
    case "180+ days":
      return "bg-red-100"
    default:
      return ""
  }
}

export default function MetaVRAgingDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAgingBucket, setSelectedAgingBucket] = useState("all")
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
    key: "daysInInventory",
    direction: "descending",
  })

  // Toggle expanded state for an item
  const toggleItemExpanded = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Filter and sort data
  const filteredAndSortedData = [...metaVRInventoryData]
    .filter((item) => {
      const matchesSearch =
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

      const matchesAgingBucket = selectedAgingBucket === "all" || item.agingBucket === selectedAgingBucket

      return matchesSearch && matchesCategory && matchesAgingBucket
    })
    .sort((a, b) => {
      const key = sortConfig.key as keyof VRInventoryAgingItem
      const aValue = a[key]
      const bValue = b[key]

      // Handle undefined values safely
      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return sortConfig.direction === "ascending" ? 1 : -1
      if (bValue === undefined) return sortConfig.direction === "ascending" ? -1 : 1

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })

  // Calculate summary metrics
  const totalItems = filteredAndSortedData.length
  const totalValue = filteredAndSortedData.reduce((sum, item) => sum + item.totalValue, 0)
  const averageDaysInInventory = Math.round(
    filteredAndSortedData.reduce((sum, item) => sum + item.daysInInventory, 0) / (filteredAndSortedData.length || 1),
  )
  const criticalItems = filteredAndSortedData.filter((item) => item.riskLevel === "critical").length
  const highTechRiskItems = filteredAndSortedData.filter((item) => item.techObsolescenceRisk === "high").length

  // Get unique categories for filter
  const categories = Array.from(new Set(metaVRInventoryData.map((item) => item.category)))

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Meta VR Inventory Aging Dashboard</CardTitle>
              <CardDescription>
                VR headsets and accessories with aging alerts and tech obsolescence tracking
              </CardDescription>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search VR SKUs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAgingBucket} onValueChange={setSelectedAgingBucket}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Aging Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  <SelectItem value="0-30 days">0-30 days</SelectItem>
                  <SelectItem value="31-60 days">31-60 days</SelectItem>
                  <SelectItem value="61-90 days">61-90 days</SelectItem>
                  <SelectItem value="91-120 days">91-120 days</SelectItem>
                  <SelectItem value="121-180 days">121-180 days</SelectItem>
                  <SelectItem value="180+ days">180+ days</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                More Filters
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total VR SKUs</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Days in Inventory</p>
                <p className="text-2xl font-bold">{averageDaysInInventory}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Items</p>
                <p className="text-2xl font-bold">{criticalItems}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Tech Risk</p>
                <p className="text-2xl font-bold">{highTechRiskItems}</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>VR Inventory Aging Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-[140px]">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort("sku")}>
                    SKU
                    {sortConfig.key === "sku" && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 ${sortConfig.direction === "descending" ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead className="min-w-[200px]">Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end cursor-pointer" onClick={() => requestSort("quantity")}>
                    Quantity
                    {sortConfig.key === "quantity" && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 ${sortConfig.direction === "descending" ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">
                  <div
                    className="flex items-center justify-end cursor-pointer"
                    onClick={() => requestSort("totalValue")}
                  >
                    Total Value
                    {sortConfig.key === "totalValue" && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 ${sortConfig.direction === "descending" ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">
                  <div
                    className="flex items-center justify-end cursor-pointer"
                    onClick={() => requestSort("daysInInventory")}
                  >
                    Days in Inventory
                    {sortConfig.key === "daysInInventory" && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 ${sortConfig.direction === "descending" ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>Aging Bucket</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Tech Risk</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow
                    className={`cursor-pointer hover:bg-muted/50 ${expandedItems.includes(item.id) ? "bg-muted/20" : ""}`}
                    onClick={() => toggleItemExpanded(item.id)}
                  >
                    <TableCell>
                      {expandedItems.includes(item.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.totalValue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <span className="font-medium">{item.daysInInventory}</span>
                        {item.daysInInventory > 120 && <AlertCircle className="ml-1 h-4 w-4 text-red-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getAgingBucketColor(item.agingBucket)}`}>
                        {item.agingBucket}
                      </Badge>
                    </TableCell>
                    <TableCell>{getRiskBadge(item.riskLevel)}</TableCell>
                    <TableCell>{getTechObsolescenceBadge(item.techObsolescenceRisk)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>VR Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Product Details</DropdownMenuItem>
                          <DropdownMenuItem>View Sales History</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Create VR Bundle</DropdownMenuItem>
                          <DropdownMenuItem>Apply Discount</DropdownMenuItem>
                          <DropdownMenuItem>Transfer to High-Traffic Store</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Target Enterprise Sales</DropdownMenuItem>
                          <DropdownMenuItem>Launch Trade-in Program</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Mark for Liquidation</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Content */}
                  {expandedItems.includes(item.id) && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={11} className="p-0">
                        <div className="bg-muted/20 p-4 border-t border-b">
                          <Tabs defaultValue="kpis">
                            <TabsList className="mb-4">
                              <TabsTrigger value="kpis">VR KPIs</TabsTrigger>
                              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                              <TabsTrigger value="details">Product Details</TabsTrigger>
                            </TabsList>

                            {/* KPIs Tab */}
                            <TabsContent value="kpis">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {item.kpis.map((kpi, index) => (
                                  <Card key={index}>
                                    <CardContent className="p-4">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-muted-foreground">{kpi.name}</p>
                                        {getTrendIcon(kpi.trend)}
                                      </div>
                                      <div className="mt-1">
                                        <p className="text-2xl font-bold">{kpi.value}</p>
                                        {kpi.target && (
                                          <div className="mt-2">
                                            <p className="text-xs text-muted-foreground">
                                              Target: {kpi.target} {kpi.unit || ""}
                                            </p>
                                            <Progress
                                              value={
                                                typeof kpi.value === "number"
                                                  ? (kpi.value / (kpi.target as number)) * 100
                                                  : 0
                                              }
                                              indicatorColor="bg-blue-500"
                                              className="h-1 mt-1"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </TabsContent>

                            {/* Recommendations Tab */}
                            <TabsContent value="recommendations">
                              <div className="space-y-4">
                                {item.recommendations.map((rec) => (
                                  <Card key={rec.id}>
                                    <CardContent className="p-4">
                                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                        <div>
                                          <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="secondary">{rec.type}</Badge>
                                            {getPriorityBadge(rec.priority)}
                                            <Badge variant="outline" className="text-xs">
                                              {rec.timeframe}
                                            </Badge>
                                          </div>
                                          <h4 className="font-semibold text-lg">{rec.action}</h4>
                                          <p className="text-sm text-muted-foreground mt-1">{rec.impact}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                                          {rec.potentialSavings && (
                                            <div className="text-right">
                                              <p className="text-xs text-muted-foreground">Potential Savings</p>
                                              <p className="font-semibold text-green-600">
                                                {formatCurrency(rec.potentialSavings)}
                                              </p>
                                            </div>
                                          )}
                                          <Button size="sm">Implement</Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </TabsContent>

                            {/* Details Tab */}
                            <TabsContent value="details">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Product Information</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <dl className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Location:</dt>
                                        <dd className="font-medium">{item.location}</dd>
                                      </div>
                                      <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Unit Cost:</dt>
                                        <dd className="font-medium">{formatCurrency(item.unitCost)}</dd>
                                      </div>
                                      <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Total Value:</dt>
                                        <dd className="font-medium">{formatCurrency(item.totalValue)}</dd>
                                      </div>
                                      <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Turnover Rate:</dt>
                                        <dd className="font-medium">{item.turnoverRate.toFixed(1)}</dd>
                                      </div>
                                    </dl>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Product Lifecycle</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <dl className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Launch Date:</dt>
                                        <dd className="font-medium">{item.launchDate}</dd>
                                      </div>
                                      <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Days in Inventory:</dt>
                                        <dd className="font-medium">{item.daysInInventory}</dd>
                                      </div>
                                      <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Last Movement:</dt>
                                        <dd className="font-medium">{item.lastMovementDate}</dd>
                                      </div>
                                      {item.nextGenReleaseDate && (
                                        <div className="flex justify-between">
                                          <dt className="text-muted-foreground">Next Gen Release:</dt>
                                          <dd className="font-medium text-orange-600">{item.nextGenReleaseDate}</dd>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Tech Risk:</dt>
                                        <dd className="font-medium">
                                          {item.techObsolescenceRisk.charAt(0).toUpperCase() +
                                            item.techObsolescenceRisk.slice(1)}
                                        </dd>
                                      </div>
                                    </dl>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">VR Actions</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      <Button size="sm" className="w-full">
                                        View VR Analytics
                                      </Button>
                                      <Button size="sm" variant="outline" className="w-full">
                                        View Competitor Pricing
                                      </Button>
                                      <Button size="sm" variant="outline" className="w-full">
                                        Check VR Market Trends
                                      </Button>
                                      <Button size="sm" variant="outline" className="w-full">
                                        Generate VR Report
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* VR-Specific Legend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">VR Inventory Management Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Aging Bucket Colors:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border rounded"></div>
                  <span className="text-xs">0-30 days (Optimal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 border rounded"></div>
                  <span className="text-xs">31-60 days (Good)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-50 border rounded"></div>
                  <span className="text-xs">61-90 days (Monitor)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border rounded"></div>
                  <span className="text-xs">91-120 days (Action Needed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-100 border rounded"></div>
                  <span className="text-xs">121-180 days (High Risk)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border rounded"></div>
                  <span className="text-xs">180+ days (Critical)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">VR-Specific Considerations:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• VR technology evolves rapidly - monitor tech obsolescence risk</li>
                <li>• New generation releases significantly impact older model demand</li>
                <li>• Consider bundling strategies to increase value proposition</li>
                <li>• Enterprise and education markets may accept older models</li>
                <li>• Seasonal demand patterns affect VR product movement</li>
                <li>• Accessory attach rates are crucial for profitability</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
