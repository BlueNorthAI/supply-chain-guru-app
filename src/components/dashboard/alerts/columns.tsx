import { ColumnDef } from '@tanstack/react-table'


// import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ButtonNormal } from '@/components/ui/button-normal'
import { Button } from '@/components/ui/button'
import { statuses, dot } from '@/components/dashboard/alerts/data'
import { Task } from '@/components/dashboard/alerts/schema'
import { ArrowUpDown } from 'lucide-react'
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';



const ButtonOpenEvent = ({ row }: { row: { original: { id: string } } }) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();


  return (
    <ButtonNormal
      className="bg-yellow-50 border border-yellow-300 text-yellow-700 hover:bg-yellow-100"
      // onClick={() => router.push(`/workspaces/${row.original.workspaceId}/incidents/${row.original.id}/exp/${row.original.expId}`)}
      onClick={() => router.push(`/workspaces/${workspaceId}/alert/${row.original.id}`)}
    >
      Open Event
    </ButtonNormal>

  );
};
const TaskActionCell = () => {
  const { open } = useCreateTaskModal();

  return (
    <ButtonNormal className="h-8 w-8 hover:bg-green-500" onClick={open}>
      <span className="text-center text-xl font-bold text-white">+</span>
    </ButtonNormal>
  );
};

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate  ">{row.getValue('id')}</span>
        </div>
      )
    },
    enableSorting: true,

  },

  {
    accessorKey: 'warehouseId',

    header: 'Warehouse Id',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate  ">{row.getValue('warehouseId')}</span>
        </div>
      )
    },
    enableSorting: true,

  },
  {
    accessorKey: 'risk',
    header: 'Risk',
    cell: ({ row }) => {
      const status = dot.find(
        (status) => status.value === row.getValue('risk')
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[80px] items-center">
          {status && (
            <svg
              className={`${status.fill} mr-2 h-2 w-2`}
              viewBox="0 0 6 6"
              aria-hidden="true"
            >
              <circle cx={3} cy={3} r={3} />
            </svg>
          )}
          {status && status.label ? <span>{status.label}</span> : null}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: 'sitesAffected',

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sites Affected
        < ArrowUpDown className="ml-2 h-4 w-4" />
      </ Button >
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium ">
            {row.getValue('sitesAffected')}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: 'projectedLoss',
    header: 'Projected Loss',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate  ">
            {row.getValue('projectedLoss')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'resolution',
    header: 'Resolution',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate  ">
            {row.getValue('resolution')}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate  ">{row.getValue('description')}</span>
        </div>
      )
    },
  },

  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          < ArrowUpDown className="ml-2 h-4 w-4" />
        </ Button >
      )
    },
    cell: ({ row }) => {
      // console.log(row.getValue('status'))
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )
      if (!status) {
        return null
      }

      return (
        <div className={`flex w-[150px] items-center ${status.textClr}`}>
          {status.icon ? (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          ) : null}
          <span className="text-base font-semibold">{status.label}</span>
        </div>
      )
    },

  },
  {
    accessorKey: 'actions',
    header: 'Options',
    cell: ({ row }) => {
      // console.log(row.original)
      return (
        <ButtonOpenEvent row={row} />
      )
    },
  },
  {
    accessorKey: 'actions',
    header: 'Tasks',

    cell: () => {

      // console.log(row.original)
      return (


        <TaskActionCell />

      )
    },
  },

]
