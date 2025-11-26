"use client"
import { processLabel, statuses, dot } from '@/components/dashboard/alerts/data'
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ResolutionTab from '@/components/incidents/ResolutionTab'
import SnopTab from '@/components/incidents/S&OpTab'
import { Badge } from '@/components/ui/badge';
// import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
// import { useGetAlerts } from "@/features/alerts/api/use-get-alerts";
import { useEffect, useState } from 'react';
import tasksData from "@/app/(dashboard)/workspaces/[workspaceId]/alert/tasks.json";
import { useParams } from 'next/navigation';


export default function AlertPage() {
    // const workspaceId = useWorkspaceId();
    // const { data: alerts } = useGetAlerts({ workspaceId });
    const data = tasksData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [exp, setExp] = useState<any>(null);
    const params = useParams();
    const Id = params.Id;

    console.log(Id);

    useEffect(() => {
        if (data) {
            const foundAlert = data.find((alert) => alert.id === Id);
            setExp(foundAlert);
        }
    }, [Id]);

    const status = statuses.find((status) => status.value === exp?.status)
    if (!status) {
        return null
    }

    const dots = dot.find((d) => d.value === exp?.severity)

    const processLabels = processLabel.find((label) => label.value === exp?.process)

    if (!dots) {
        return null
    }

    return (
        <div className="bg-white  w-full rounded-lg border mt-2">
            <div className="p-2 flex items-center justify-between">
                <div className="min-w-0">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Summary - {exp?.warehouseId}
                    </h1>
                    <h2 className="mt-1 text-base text-gray-600">{exp?.description}</h2>

                    <div className="mt-1 flex flex-row flex-wrap space-x-4 sm:mt-0">
                        {statuses.map((statusItem, index) => (
                            <div key={`status_${statusItem.value}_${index}`} className="mt-2 flex items-center text-sm text-green-700">
                                <div className={`flex items-center ${statusItem.textClr}`}>
                                    {statusItem.icon ? (
                                        <statusItem.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                    ) : null}
                                    <span className="text-base font-semibold">
                                        {statusItem.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                        
                        {processLabels && (
                            <div key={`process_${processLabels.value}`} className='mt-2 flex items-center text-sm'>
                                <Badge
                                    className={`rounded-md ${processLabels.color} ${processLabels.textClr}`}
                                    variant="outline"
                                >
                                    {processLabels.label}
                                </Badge>
                            </div>
                        )}
                        
                        {dots && (
                            <div key={`severity_${dots.value}`} className="mt-2 flex items-center text-sm text-gray-500">
                                <div className="flex w-[80px] items-center">
                                    {dots && (
                                        <svg
                                            className={`${dots.fill} mr-2 h-2 w-2`}
                                            viewBox="0 0 6 6"
                                            aria-hidden="true"
                                        >
                                            <circle cx={3} cy={3} r={3} />
                                        </svg>
                                    )}
                                    {dots && dots.label ? <span>{dots.label}</span> : null}
                                </div>
                            </div>
                        )}

                        <div className="mt-2 flex items-center">
                            <Image
                                className="h-5 w-5 rounded-full"

                                src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                                alt=""
                                width={20}
                                height={20}
                            />


                            <div className="ml-2 text-sm text-gray-500">{exp?.owner}</div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="m-2">
                <Tabs defaultValue="Resolution" className="tracking-normal">
                    <TabsList className="">
                        <TabsTrigger value="Resolution" className="relative">
                            Resolution
                        </TabsTrigger>
                        <TabsTrigger className="" value="S&OP">
                            Link to S&OP
                        </TabsTrigger>
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

    )

}






