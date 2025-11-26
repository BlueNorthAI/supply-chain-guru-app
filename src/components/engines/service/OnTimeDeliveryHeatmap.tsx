"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function OnTimeDeliveryHeatmap() {
  // Define the locations (columns)
  const locations = [
    "Location1021",
    "Location1062",
    "Location111",
    "Location110",
    "Location113",
    "Location113-3",
    "Location114-4",
    "Location124",
    "Location125",
    "Location126",
    "Location1",
    "Location5-7",
    "Location45-8",
    "Location69-3",
  ]

  // Define the carriers (rows) and their performance data
  const carriers = [
    {
      name: "Carrier5",
      data: {
        Location1021: 99,
        Location1062: 100,
        Location111: 99,
        Location110: 85,
        Location113: 100,
        "Location113-3": 100,
        Location1: 100,
        "Location69-3": 93,
      },
    },
    {
      name: "Carrier2",
      data: {
        Location1021: 98,
        Location111: 96,
        Location124: 100,
        Location1: 100,
        "Location5-7": 97,
      },
    },
    {
      name: "Carrier50",
      data: {
        Location124: 100,
      },
    },
    {
      name: "Carrier53",
      data: {
        Location1062: 94,
        Location110: 83,
        Location124: 100,
      },
    },
    {
      name: "Carrier33",
      data: {
        Location1062: 93,
        "Location45-8": 94,
      },
    },
    {
      name: "Carrier26",
      data: {
        Location1062: 89,
        Location111: 100,
        Location110: 100,
        Location124: 100,
        Location125: 75,
        Location126: 96,
        Location1: 100,
        "Location69-3": 96,
      },
    },
    {
      name: "Carrier14",
      data: {
        Location1062: 98,
        Location111: 100,
        Location110: 97,
        Location113: 98,
        Location124: 93,
      },
    },
    {
      name: "Carrier29",
      data: {
        Location1062: 93,
        Location110: 95,
      },
    },
    {
      name: "Carrier13",
      data: {
        Location111: 100,
      },
    },
    {
      name: "Carrier55",
      data: {
        Location111: 100,
        Location110: 94,
        "Location69-3": 99,
      },
    },
    {
      name: "Carrier12",
      data: {},
    },
    {
      name: "Carrier38",
      data: {
        Location1062: 98,
        Location110: 98,
        Location124: 100,
      },
    },
    {
      name: "Carrier35",
      data: {
        Location1062: 97,
      },
    },
    {
      name: "Carrier27",
      data: {
        Location110: 95,
        Location124: 100,
        "Location5-7": 99,
      },
    },
    {
      name: "Carrier3",
      data: {},
    },
    {
      name: "Carrier51",
      data: {
        Location126: 100,
        "Location69-3": 100,
      },
    },
    {
      name: "OTHERS",
      data: {
        Location1062: 85,
        Location110: 94,
        Location113: 100,
        Location124: 100,
        Location125: 100,
        Location126: 100,
        Location1: 100,
        "Location5-7": 100,
        "Location45-8": 99,
      },
    },
    {
      name: "Grand Total",
      data: {
        Location1021: 100,
        Location1062: 97,
        Location111: 100,
        Location110: 97,
        Location113: 98,
        "Location113-3": 100,
        Location124: 99,
        Location125: 100,
        Location126: 100,
        Location1: 100,
        "Location5-7": 98,
        "Location45-8": 95,
        "Location69-3": 93,
      },
    },
  ]

  // Function to determine cell background color based on percentage
  const getCellColor = (percentage: number | null) => {
    if (percentage === null) return "bg-transparent"

    if (percentage >= 98) return "bg-green-600 text-white"
    if (percentage >= 95) return "bg-green-500 text-white"
    if (percentage >= 90) return "bg-green-400 text-white"
    if (percentage >= 85) return "bg-yellow-500 text-white"
    if (percentage >= 80) return "bg-yellow-600 text-white"
    return "bg-red-600 text-white"
  }

  return (
    <Card className="">
      <CardHeader className="">
        <CardTitle className="flex items-center justify-between">
          <span>On Time Delivery Heatmap</span>
          <div className="flex items-center text-xs gap-1">
            <span>75%</span>
            <div className="w-24 h-4 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-sm"></div>
            <span>100%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent >
        <div className="overflow-auto h-[200px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold sticky left-0 bg-white z-10">Carriers</TableHead>
                {locations.map((location) => (
                  <TableHead key={location} className="font-semibold text-xs p-1 text-center whitespace-nowrap">
                    <div className="transform -rotate-45 origin-left translate-y-2 h-16 w-16">{location}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {carriers.map((carrier) => (
                <TableRow
                  key={carrier.name}
                  className={
                    carrier.name === "Grand Total"
                      ? "font-medium border-t-2"
                      : carrier.name === "OTHERS"
                        ? "font-medium"
                        : ""
                  }
                >
                  <TableCell className="font-medium sticky left-0 bg-white z-10">{carrier.name}</TableCell>
                  {locations.map((location) => {
                    const value = carrier.data[location as keyof typeof carrier.data] || null
                    return (
                      <TableCell
                        key={`${carrier.name}-${location}`}
                        className={`text-center p-1 ${getCellColor(value)}`}
                      >
                        {value ? `${value}%` : ""}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

