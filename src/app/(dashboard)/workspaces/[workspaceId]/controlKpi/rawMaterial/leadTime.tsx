import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SupplyChainData {
  part: string
  site: string
  date: string
  responsible: string
  rows: {
    type: "Demand" | "Firm Supply" | "Inventory" | "Balance"
    past: number
    weeks: number[]
  }[]
}

const supplyChainData: SupplyChainData[] = [
  {
    part: "S1001",
    site: "E3001",
    date: "06-08-17",
    responsible: "Master Administrator",
    rows: [
      {
        type: "Demand",
        past: 0,
        weeks: [31739, 25000, 25000, 25000, 25000, 25000, 0, 25000, 0, 25000, 0],
      },
      {
        type: "Firm Supply",
        past: 95,
        weeks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        type: "Inventory",
        past: 95,
        weeks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        type: "Balance",
        past: 95,
        weeks: [-31644, -56644, -81644, -106644, -131644, -156644, -156644, -181644, -181644, -206644, -206644],
      },
    ],
  },
  {
    part: "E3003",
    site: "",
    date: "06-21-17",
    responsible: "Master Administrator",
    rows: [
      {
        type: "Demand",
        past: 0,
        weeks: [76772, 75000, 25000, 50000, 0, 25000, 25000, 25000, 25000, 25000, 25000],
      },
      {
        type: "Firm Supply",
        past: 0,
        weeks: [0, 36265, 46436, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        type: "Inventory",
        past: 82000,
        weeks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        type: "Balance",
        past: 82000,
        weeks: [5228, -33507, -6071, -56071, -56071, -81071, -106071, -131071, -156071, -181071, -206071],
      },
    ],
  },
  {
    part: "P1001",
    site: "",
    date: "06-07-17",
    responsible: "Master Administrator",
    rows: [
      {
        type: "Demand",
        past: 0,
        weeks: [63813, 25000, 0, 25000, 25000, 25000, 25000, 0, 25000, 0, 25000],
      },
      {
        type: "Firm Supply",
        past: 0,
        weeks: [31979, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        type: "Inventory",
        past: 95,
        weeks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        type: "Balance",
        past: 95,
        weeks: [-31739, -56739, -56739, -81739, -106739, -131739, -156739, -156739, -181739, -181739, -206739],
      },
    ],
  },
  {
    part: "P2001",
    site: "",
    date: "06-07-17",
    responsible: "Master Administrator",
    rows: [
      {
        type: "Demand",
        past: 0,
        weeks: [74903, 75000, 50000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000],
      },
      {
        type: "Firm Supply",
        past: 0,
        weeks: [29036, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        type: "Inventory",
        past: 95,
        weeks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        type: "Balance",
        past: 95,
        weeks: [-45772, -120772, -170772, -195772, -220772, -245772, -270772, -295772, -320772, -345772, -370772],
      },
    ],
  },
  {
    part: "B1010",
    site: "E3001",
    date: "06-26-17",
    responsible: "Master Administrator",
    rows: [
      {
        type: "Demand",
        past: 0,
        weeks: [56644, 0, 25000, 25000, 25000, 25000, 0, 25000, 0, 25000, 0],
      },
      {
        type: "Firm Supply",
        past: 0,
        weeks: [101797, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        type: "Inventory",
        past: 2930,
        weeks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        type: "Balance",
        past: 2930,
        weeks: [48083, 48083, 23083, -1917, -26917, -51917, -51917, -76917, -76917, -101917, -101917],
      },
    ],
  },
  {
    part: "E3003",
    site: "",
    date: "07-10-17",
    responsible: "Master Administrator",
    rows: [
      {
        type: "Demand",
        past: 0,
        weeks: [21198, 34563, 25000, 25000, 25000, 25000, 25000, 25000, 0, 25000, 0],
      },
    ],
  },
]

// Generate date headers
const getDateHeaders = (): string[] => {
  return [
    "06-05-17",
    "06-12-17",
    "06-19-17",
    "06-26-17",
    "07-03-17",
    "07-10-17",
    "07-17-17",
    "07-24-17",
    "07-31-17",
    "08-07-17",
    "08-14-17",
    "08-21",
  ]
}

const getCellColor = (type: string, value: number): string => {
  if (type === "Balance" && value < 0) {
    return "text-red-600 font-medium"
  }
  return ""
}

const formatValue = (value: number): string => {
  if (value === 0) return "0"
  return value.toLocaleString()
}

export default function SupplyChainPlanning() {
  const dateHeaders = getDateHeaders()

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Raw Material Coverage </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-blue-500 text-white">
                  <TableHead className="text-white font-semibold w-8">#</TableHead>
                  <TableHead className="text-white font-semibold min-w-[80px]">Part</TableHead>
                  <TableHead className="text-white font-semibold min-w-[80px]">Site</TableHead>
                  <TableHead className="text-white font-semibold min-w-[80px]">Date</TableHead>
                  <TableHead className="text-white font-semibold min-w-[120px]">Responsible</TableHead>
                  <TableHead className="text-white font-semibold min-w-[100px]">Past</TableHead>
                  {dateHeaders.map((date, index) => (
                    <TableHead key={index} className="text-white font-semibold text-center min-w-[80px]">
                      {date}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplyChainData.map((item, itemIndex) => (
                  <React.Fragment key={itemIndex}>
                    {item.rows.map((row, rowIndex) => (
                      <TableRow key={`${itemIndex}-${rowIndex}`} className={rowIndex % 4 === 0 ? "border-t-2" : ""}>
                        {rowIndex === 0 && (
                          <>
                            <TableCell rowSpan={item.rows.length} className="font-medium text-center bg-gray-50">
                              {itemIndex + 1}
                            </TableCell>
                            <TableCell rowSpan={item.rows.length} className="font-medium bg-blue-100">
                              {item.part}
                            </TableCell>
                            <TableCell rowSpan={item.rows.length} className="bg-gray-50">
                              {item.site}
                            </TableCell>
                            <TableCell rowSpan={item.rows.length} className="bg-gray-50">
                              {item.date}
                            </TableCell>
                            <TableCell rowSpan={item.rows.length} className="bg-gray-50 text-xs">
                              <div className="flex items-center gap-1">
                                <span className="text-blue-600">👤</span>
                                {item.responsible}
                              </div>
                            </TableCell>
                          </>
                        )}
                        <TableCell className="font-medium bg-yellow-50">{row.type}</TableCell>
                        <TableCell className="text-center">{formatValue(row.past)}</TableCell>
                        {row.weeks.map((week, weekIndex) => (
                          <TableCell key={weekIndex} className={`text-center ${getCellColor(row.type, week)}`}>
                            {formatValue(week)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supply Chain Planning Legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Row Types:</h4>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>Demand:</strong> Forecasted or planned demand for the period
                </li>
                <li>
                  <strong>Firm Supply:</strong> Confirmed supply/production orders
                </li>
                <li>
                  <strong>Inventory:</strong> Current inventory levels
                </li>
                <li>
                  <strong>Balance:</strong> Calculated available inventory (negative = shortage)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Color Coding:</h4>
              <ul className="text-sm space-y-1">
                <li>
                  <span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span>Header: Time periods
                </li>
                <li>
                  <span className="inline-block w-4 h-4 bg-blue-100 mr-2"></span>Part numbers
                </li>
                <li>
                  <span className="inline-block w-4 h-4 bg-yellow-50 mr-2"></span>Row types
                </li>
                <li>
                  <span className="text-red-600 font-medium">Red text:</span> Negative balance (shortage)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
