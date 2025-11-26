'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ProductTable,
  CustomerTable,
  InventoryTable,
  ExcessTable,
} from './ProductTable'
import { DonutChartContainer } from '@/app/kendo/charts/donut/kendoDonutChart'
import { MultiStackColChartContainer } from '@/app/kendo/charts/stackcol/kendoStackColChart'
import { MultiColumnChartContainer } from '@/app/kendo/charts/column/kendoColumnChart'
import { MultiBarChartContainer } from '@/app/kendo/charts/bar/kendoBarChart'
import { PieChartContainer } from '@/app/kendo/charts/pie/kendoPieChart'
import { MultiAreaChartContainer } from '@/app/kendo/charts/area/kendoAreaChart'
import { MultiLineChartContainer } from '@/app/kendo/charts/line/kendoLineChart'
import {
  leadData_m,
  campaignCategories_m,
  campaignSeries_m,
  pipelineCategories_m,
  pipelineSeries_m,
  openCategories_m,
  openSeries_m,
} from '@/app/kendo/rawData/dashboard/salesDashboard'
import {
  handbalance_m,
  avgInventoryCategories_m,
  avgInventorySeries_m,
  materialCategories_m,
  materialSeries_m,
  turnsCategories_m,
  turnsSeries_m,
} from '@/app/kendo/rawData/dashboard/inventoryDashboard'
import {
  lateCategories_m,
  lateSeries_m,
  ontimeCategories_m,
  ontimeSeries_m,
  perfectCategories_m,
  perfectFirstSeries_m,
  invoiceCategories_m,
  invoiceSeries_m,
} from '@/app/kendo/rawData/dashboard/demandDashboard'

import taskData from '@/features/trackTrace/components/tasks.json'


// Define the type for KPI objects
interface KPI {
  Name: string;
  Value: string | number;
  Trend: string;
  TargetAch: string | number;
  container: React.ReactNode;
  status: string;
  Analyze: string;
}

const kpicust_m = [
  {
    Name: 'Lead Conversion Rate',
    Value: '14.91',
    Trend: 'up',
    TargetAch: '83',
    container: <DonutChartContainer series={leadData_m} />,
    status: 'Above Target',
    Analyze: "",
  },
  {
    Name: 'Campaign ROI',
    Value: '4.33',
    Trend: 'up',
    TargetAch: '$291.96',
    container: (
      <MultiBarChartContainer
        categories={campaignCategories_m}
        series={campaignSeries_m}
      />
    ),
    status: 'Above Target',
    Analyze: "",
  },
  {
    Name: 'Campaign Attributed Pipeline',
    Value: '7.49M',
    Trend: 'down',
    TargetAch: 0,
    container: (
      <MultiStackColChartContainer
        categories={pipelineCategories_m}
        series={pipelineSeries_m}
      />
    ),
    status: 'On Track',
    Analyze: "",
  },
  {
    Name: 'Open Pipeline',
    Value: '$10.02M',
    Trend: 'down',
    TargetAch: '$47.13k',
    container: (
      <MultiColumnChartContainer
        categories={openCategories_m}
        series={openSeries_m}
      />
    ),
    status: 'Above Target',
    Analyze: "",
  },
]

const kpiInventory = [
  {
    Name: 'On Hand Balance',
    Value: '$8.46B',
    Trend: 'up',
    TargetAch: 83,
    container: <PieChartContainer series={handbalance_m} />,
    status: 'Above Target',
    Analyze: "",
  },
  {
    Name: 'Avg Inventory Valuation',
    Value: '$233.57M',
    Trend: 'up',
    TargetAch: 80,
    container: (
      <MultiBarChartContainer
        categories={avgInventoryCategories_m}
        series={avgInventorySeries_m}
      />
    ),
    status: 'Below Target',
    Analyze: "",
  },
  {
    Name: 'Material Cost',
    Value: '$4.17B',
    Trend: 'up',
    TargetAch: 77,
    container: (
      <MultiBarChartContainer
        categories={materialCategories_m}
        series={materialSeries_m}
      />
    ),
    status: 'Below Target',
    Analyze: "",
  },
  {
    Name: 'Inventory Turns',
    Value: '7',
    Trend: 'up',
    TargetAch: 95,
    container: (
      <MultiBarChartContainer
        categories={turnsCategories_m}
        series={turnsSeries_m}
      />
    ),
    status: 'Above Target',
    Analyze: "",
  },
]

const kpiProduct = [
  {
    Name: 'Late Shipments',
    Value: '$361.89M',
    Trend: 'up',
    TargetAch: 90,
    container: (
      <MultiColumnChartContainer
        categories={lateCategories_m}
        series={lateSeries_m}
      />
    ),
    status: 'On Track',
    Analyze: "",
  },
  {
    Name: 'On Time Shipment %',
    Value: '73.8%',
    Trend: 'down',
    TargetAch: 90,
    container: (
      <MultiAreaChartContainer
        categories={ontimeCategories_m}
        series={ontimeSeries_m}
      />
    ),
    status: 'Below Target',
    Analyze: "",
  },
  {
    Name: 'Perfect Order %',
    Value: '$300M',
    Trend: 'up',
    TargetAch: 77,
    container: (
      <MultiBarChartContainer
        categories={perfectCategories_m}
        series={perfectFirstSeries_m}
      />
    ),
    status: 'On Track',
    Analyze: "",
  },
  {
    Name: 'Order to Invoice Cycle Time',
    Value: '75',
    Trend: 'up',
    TargetAch: 95,
    container: (
      <MultiLineChartContainer
        categories={invoiceCategories_m}
        series={invoiceSeries_m}
      />
    ),
    status: 'Above Target',
    Analyze: "",
  },
]



// eslint-disable-next-line @next/next/no-async-client-component
export default async function Page({
    params,
}: {
    params: Promise<{ orderId: string }>
}) {
    const orderId = (await params).orderId
    const exp = taskData?.filter((task) => task.orderId === orderId)[0]
  return (
      <div className="bg-white rounded-lg border" role="region" aria-label="Order summary">
        <div className="flex items-center w-full justify-between border rounded-t-lg text-2xl text-blue-900 font-bold">
          <div className="p-2">{exp ? `Order Summary - ${exp.orderId}` : `Order with ID ${orderId} not found`}</div>
        </div>

        <div className="flex justify-center">
          <ul className="timeline">
            <li>
              <div className="timeline-middle text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="timeline-end timeline-box">Ordered</div>

              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-middle text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="timeline-end timeline-box ">
                Supplier Dispatched
              </div>
              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-middle text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="timeline-end timeline-box">DC Dispatched</div>
              <hr />
            </li>
            <li>
              <hr />
              <div className="timeline-middle text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="timeline-end timeline-box ">Store Received</div>
            </li>
          </ul>
        </div>

        <div className="m-2">
          <Tabs defaultValue="Product" className="tracking-normal">
            <TabsList className="">
              <TabsTrigger value="Product" className="relative">
                Product
              </TabsTrigger>
              <TabsTrigger className="" value="Customer">
                Customer
              </TabsTrigger>
              <TabsTrigger className="" value="Inventory">
                Inventory
              </TabsTrigger>
              <TabsTrigger className="" value="Service">
                Service Levels
              </TabsTrigger>
              <TabsTrigger className="" value="Supplier">
                Supplier
              </TabsTrigger>
              <TabsTrigger className="" value="Transporter">
                Transporter
              </TabsTrigger>
              <TabsTrigger className="" value="DC">
                DC
              </TabsTrigger>
              <TabsTrigger className="" value="Store">
                Store
              </TabsTrigger>
            </TabsList>

            <TabsContent value="Product">
              <div className="py-2 grid grid-cols-2 ">
                <div>
                  <ProductTable />
                </div>
                <div className="">
                  {' '}
                  <ul className="mx-4  grid grid-cols-2 gap-6">
                    {kpiProduct.map((kpi) => (
                      <li
                        key={kpi.Name}
                        className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow-xl shadow-slate-900/10 border"
                      >
                        <div className="relative flex flex-1 flex-col py-2 pl-3">
                          <span
                            className={`absolute inset-x-0 top-0 h-1 rounded-lg ${kpi.status === 'Above Target'
                              ? `bg-green-500`
                              : kpi.status === 'Below Target'
                                ? `bg-red-500`
                                : ''
                              }`}
                          ></span>
                          <div className="my-2 flex items-baseline gap-2">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                {kpi.Name}
                              </h3>
                              {/* <h1 className="text-4xl font-bold text-black">
                                {kpi.Value}
                              </h1> */}
                            </div>
                          </div>
                          <div className="">{kpi.container}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Customer">
              <div className="py-2 grid grid-cols-2 ">
                <div>
                  <CustomerTable />
                </div>
                <div className="">
                  {' '}
                  <ul className="mx-4 grid grid-cols-2 gap-6">
                    {kpicust_m.map((kpi) => (
                      <li
                        key={kpi.Name}
                        className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow-xl shadow-slate-900/10 border"
                      >
                        <div className="relative flex flex-1 flex-col py-2 pl-3">
                          <span
                            className={`absolute inset-x-0 top-0 h-1 rounded-lg ${kpi.status === 'Above Target'
                              ? `bg-green-500`
                              : kpi.status === 'Below Target'
                                ? `bg-red-500`
                                : ''
                              }`}
                          ></span>
                          <div className="my-2 flex items-baseline gap-2">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                {kpi.Name}
                              </h3>
                              {/* <h1 className="text-4xl font-bold text-black">
                                {kpi.Value}
                              </h1> */}
                            </div>
                          </div>
                          <div className="">{kpi.container}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="Inventory">
              <div className="py-2 grid grid-cols-2 ">
                <div>
                  <div className="mb-2">
                    <InventoryTable />
                  </div>
                  <ExcessTable />
                </div>
                <div className="">
                  {' '}
                  <ul className="mx-4 grid grid-cols-2 gap-6">
                    {kpiInventory.map((kpi) => (
                      <li
                        key={kpi.Name}
                        className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow-xl shadow-slate-900/10 border"
                      >
                        <div className="relative flex flex-1 flex-col py-2 pl-3">
                          <span
                            className={`absolute inset-x-0 top-0 h-1 rounded-lg ${kpi.status === 'Above Target'
                              ? `bg-green-500`
                              : kpi.status === 'Below Target'
                                ? `bg-red-500`
                                : ''
                              }`}
                          ></span>
                          <div className="my-2 flex items-baseline gap-2">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                {kpi.Name}
                              </h3>
                              {/* <h1 className="text-4xl font-bold text-black">
                                {kpi.Value}
                              </h1> */}
                            </div>
                          </div>
                          <div className="">{kpi.container}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  
  )
}
