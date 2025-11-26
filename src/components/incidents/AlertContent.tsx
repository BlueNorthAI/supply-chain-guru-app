'use client';

import { statuses, dot } from "@/components/dashboard/alerts/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResolutionTab from "@/components/incidents/ResolutionTab";
import SnopTab from "@/components/incidents/S&OpTab";

type AlertContentProps = {
  alert: {
    warehouseId: string;
    description: string;
    status: string;
    severity: string;
  };
};

export default function AlertContent({ alert }: AlertContentProps) {
  const status = statuses.find((status) => status.value === alert.status);
  const dots = dot.find((d) => d.value === alert.severity);

  if (!status || !dots) {
    return null;
  }

  return (
    <div className="bg-white w-full rounded-lg border mt-2">
      <div className="p-2 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-gray-900">Summary - {alert.warehouseId}</h1>
          <h2 className="mt-1 text-base text-gray-600">{alert.description}</h2>

          <div className="mt-1 flex flex-row flex-wrap space-x-4 sm:mt-0">
            <div className={`mt-2 flex items-center text-sm ${status.textClr}`}>
              {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
              <span className="text-base font-semibold">{status.label}</span>
            </div>

            <div className="mt-2 flex items-center text-sm text-gray-500">
              <div className="flex w-[80px] items-center">
                <svg className={`${dots.fill} mr-2 h-2 w-2`} viewBox="0 0 6 6" aria-hidden="true">
                  <circle cx={3} cy={3} r={3} />
                </svg>
                {dots.label && <span>{dots.label}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="m-2">
        <Tabs defaultValue="Resolution" className="tracking-normal">
          <TabsList>
            <TabsTrigger value="Resolution">Resolution</TabsTrigger>
            <TabsTrigger value="S&OP">Link to S&OP</TabsTrigger>
          </TabsList>

          <TabsContent value="Resolution">
            <ResolutionTab />
          </TabsContent>
          <TabsContent value="S&OP">
            <SnopTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 