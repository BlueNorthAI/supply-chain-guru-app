"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const dateHeaders = [
  "06-05-17",
  "06-12-17",
  "06-19-17",
  "06-26-17",
  "07-03-17",
  "07-10-17",
  "07-17-17",
  "07-24-17",
  "07-31-17",
]

// Chart data for the bottom visualization
const chartData = [
  { week: "06-05", available: 81000, load: 18098 },
  { week: "06-12", available: 81000, load: 74328 },
  { week: "06-19", available: 81000, load: 72496 },
  { week: "06-26", available: 81000, load: 66312 },
  { week: "07-03", available: 81000, load: 66318 },
  { week: "07-10", available: 81000, load: 66306 },
  { week: "07-17", available: 81000, load: 92426 },
  { week: "07-24", available: 81000, load: 91028 },
  { week: "07-31", available: 81000, load: 91034 },
]



export default function CapacityPlanningDashboard() {
  const [selectedConstraint, setSelectedConstraint] = useState("CA1002")
  const [selectedSite, setSelectedSite] = useState("P1002")

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-500 hover:bg-blue-500">
                  <TableHead className="text-white font-semibold w-12 text-center">#</TableHead>
                  <TableHead className="text-white font-semibold min-w-[120px] text-center">
                    <div className="space-y-1">
                      <div>Constraint</div>
                      <Select value={selectedConstraint} onValueChange={setSelectedConstraint}>
                        <SelectTrigger className="w-full bg-white text-black text-xs h-6">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA1002">CA1002</SelectItem>
                          <SelectItem value="CA1003">CA1003</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                  <TableHead className="text-white font-semibold min-w-[100px] text-center">
                    <div className="space-y-1">
                      <div>Site</div>
                      <Select value={selectedSite} onValueChange={setSelectedSite}>
                        <SelectTrigger className="w-full bg-white text-black text-xs h-6">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="P1002">P1002</SelectItem>
                          <SelectItem value="E3001">E3001</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                  {dateHeaders.map((date, index) => (
                    <TableHead key={index} className="text-white font-semibold text-center min-w-[90px]">
                      {date}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* First constraint section - CA1002/P1002 */}
                <TableRow>
                  <TableCell className="text-center font-medium">11</TableCell>
                  <TableCell className="font-medium">CA1002</TableCell>
                  <TableCell className="font-medium">P1002</TableCell>
                  <TableCell className="text-center font-medium">Load</TableCell>
                  <TableCell className="text-center">12,878</TableCell>
                  <TableCell className="text-center">38,612</TableCell>
                  <TableCell className="text-center">37,164</TableCell>
                  <TableCell className="text-center">35,757</TableCell>
                  <TableCell className="text-center">177,404</TableCell>
                  <TableCell className="text-center">33,159</TableCell>
                  <TableCell className="text-center">171,396</TableCell>
                  <TableCell className="text-center">45,522</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-center font-medium">12</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium">Over/Under Load</TableCell>
                  <TableCell className="text-center">103,000</TableCell>
                  <TableCell className="text-center">90,122</TableCell>
                  <TableCell className="text-center">64,388</TableCell>
                  <TableCell className="text-center">86,836</TableCell>
                  <TableCell className="text-center">88,243</TableCell>
                  <TableCell className="text-center bg-red-100 text-red-700 font-semibold">-53,404</TableCell>
                  <TableCell className="text-center">90,841</TableCell>
                  <TableCell className="text-center bg-red-100 text-red-700 font-semibold">-47,396</TableCell>
                  <TableCell className="text-center">57,478</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-center font-medium">13</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium">Scheduled Usage</TableCell>
                  <TableCell className="text-center">12,878</TableCell>
                  <TableCell className="text-center">38,612</TableCell>
                  <TableCell className="text-center">37,164</TableCell>
                  <TableCell className="text-center">35,757</TableCell>
                  <TableCell className="text-center">177,404</TableCell>
                  <TableCell className="text-center">33,159</TableCell>
                  <TableCell className="text-center">171,396</TableCell>
                  <TableCell className="text-center">45,522</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-center font-medium">14</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium">Assumptions</TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                </TableRow>

                <TableRow className="bg-blue-50">
                  <TableCell className="text-center font-medium">15</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium text-blue-800">Annual Plan</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-center font-medium">16</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium">Usage %</TableCell>
                  <TableCell className="text-center">13%</TableCell>
                  <TableCell className="text-center">37%</TableCell>
                  <TableCell className="text-center">30%</TableCell>
                  <TableCell className="text-center">29%</TableCell>
                  <TableCell className="text-center bg-red-100 text-red-700 font-semibold">143%</TableCell>
                  <TableCell className="text-center">27%</TableCell>
                  <TableCell className="text-center bg-red-100 text-red-700 font-semibold">138%</TableCell>
                  <TableCell className="text-center">44%</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-center font-medium">17</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium">Cumulative Usage %</TableCell>
                  <TableCell className="text-center">6%</TableCell>
                  <TableCell className="text-center">17%</TableCell>
                  <TableCell className="text-center">20%</TableCell>
                  <TableCell className="text-center">22%</TableCell>
                  <TableCell className="text-center">44%</TableCell>
                  <TableCell className="text-center">42%</TableCell>
                  <TableCell className="text-center">55%</TableCell>
                  <TableCell className="text-center">53%</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-center font-medium">18</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium">Available</TableCell>
                  <TableCell className="text-center">81,000</TableCell>
                  <TableCell className="text-center">81,000</TableCell>
                  <TableCell className="text-center">81,000</TableCell>
                  <TableCell className="text-center">81,000</TableCell>
                  <TableCell className="text-center">81,000</TableCell>
                  <TableCell className="text-center">81,000</TableCell>
                  <TableCell className="text-center">81,000</TableCell>
                  <TableCell className="text-center">81,000</TableCell>
                </TableRow>

                {/* Second constraint section - CA1003/E3001 */}
                <TableRow>
                  <TableCell className="text-center font-medium">19</TableCell>
                  <TableCell className="font-medium">CA1003</TableCell>
                  <TableCell className="font-medium">E3001</TableCell>
                  <TableCell className="text-center font-medium">Load</TableCell>
                  <TableCell className="text-center">18,098</TableCell>
                  <TableCell className="text-center">74,328</TableCell>
                  <TableCell className="text-center">72,496</TableCell>
                  <TableCell className="text-center">66,312</TableCell>
                  <TableCell className="text-center">66,318</TableCell>
                  <TableCell className="text-center">66,306</TableCell>
                  <TableCell className="text-center">92,426</TableCell>
                  <TableCell className="text-center">91,028</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-center font-medium">20</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium">Over/Under Load</TableCell>
                  <TableCell className="text-center">62,902</TableCell>
                  <TableCell className="text-center">6,672</TableCell>
                  <TableCell className="text-center">8,504</TableCell>
                  <TableCell className="text-center">14,688</TableCell>
                  <TableCell className="text-center">14,682</TableCell>
                  <TableCell className="text-center">14,694</TableCell>
                  <TableCell className="text-center bg-red-100 text-red-700 font-semibold">-11,426</TableCell>
                  <TableCell className="text-center bg-red-100 text-red-700 font-semibold">-10,028</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-center font-medium">21</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium">Scheduled Usage</TableCell>
                  <TableCell className="text-center">18,098</TableCell>
                  <TableCell className="text-center">74,328</TableCell>
                  <TableCell className="text-center">72,496</TableCell>
                  <TableCell className="text-center">66,312</TableCell>
                  <TableCell className="text-center">66,318</TableCell>
                  <TableCell className="text-center">66,306</TableCell>
                  <TableCell className="text-center">80,998</TableCell>
                  <TableCell className="text-center">81,000</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-center font-medium">22</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium">Assumptions</TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center"></TableCell>
                </TableRow>

                <TableRow className="bg-blue-50">
                  <TableCell className="text-center font-medium">23</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium text-blue-800">Annual Plan</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                  <TableCell className="text-center bg-blue-100 text-blue-800 font-medium">87%</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-center font-medium">24</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium">Usage %</TableCell>
                  <TableCell className="text-center">22%</TableCell>
                  <TableCell className="text-center">92%</TableCell>
                  <TableCell className="text-center">90%</TableCell>
                  <TableCell className="text-center">82%</TableCell>
                  <TableCell className="text-center">82%</TableCell>
                  <TableCell className="text-center">82%</TableCell>
                  <TableCell className="text-center">100%</TableCell>
                  <TableCell className="text-center">100%</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-center font-medium">25</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-medium">Cumulative Usage %</TableCell>
                  <TableCell className="text-center">11%</TableCell>
                  <TableCell className="text-center">57%</TableCell>
                  <TableCell className="text-center">68%</TableCell>
                  <TableCell className="text-center">74%</TableCell>
                  <TableCell className="text-center">73%</TableCell>
                  <TableCell className="text-center">76%</TableCell>
                  <TableCell className="text-center">78%</TableCell>
                  <TableCell className="text-center">81%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Chart Section */}
      <Card>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" angle={-45} textAnchor="end" height={80} fontSize={10} interval={0} />
                <YAxis domain={[0, 100000]} tickFormatter={(value) => `${value / 1000}K`} />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), ""]}
                  labelFormatter={(label) => `Week: ${label}`}
                />
                <Bar dataKey="available" fill="#60a5fa" name="Available Capacity" />
                <Bar dataKey="load" fill="#34d399" name="Load" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
