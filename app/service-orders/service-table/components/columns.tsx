import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin, Building, TreePine, Home } from "lucide-react";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { ServiceOrder } from "../../types/service-order";

const customIncludesStringFilter = (
  row: any,
  columnId: string,
  filterValue: string
) => {
  const searchValue = String(row.getValue(columnId) || "").toLowerCase();
  return searchValue.includes(filterValue.toLowerCase());
};

export const columns: ColumnDef<ServiceOrder, any>[] = [
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) =>
      `${row.issuedBy || ""} ${row.issuedTo || ""} ${row.serviceOrderDate || ""}`,
    filterFn: customIncludesStringFilter,
    enableHiding: true,
    enableSorting: false,
    size: 0,
    cell: () => null,
  },
  {
    accessorKey: "issuedBy",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Issued By" />,
    cell: ({ row }) => row.original.issuedBy,
  },
  {
    accessorKey: "issuedTo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Issued To" />,
    cell: ({ row }) => row.original.issuedTo,
  },
  {
    accessorKey: "serviceOrderDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order Date" />,
    cell: ({ row }) => format(new Date(row.original.serviceOrderDate), "yyyy-MM-dd"),
  },
  {
    accessorKey: "siteDetails.siteId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Site ID" />,
    cell: ({ row }) => row.original.siteDetails.siteId,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase() || '';
      const statusConfig = {
        draft: { variant: 'secondary', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
        pending: { variant: 'outline', className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50' },
        approved: { variant: 'default', className: 'bg-green-50 text-green-700 hover:bg-green-50' },
        rejected: { variant: 'destructive', className: 'bg-red-50 text-red-700 hover:bg-red-50' },
        completed: { variant: 'default', className: 'bg-blue-50 text-blue-700 hover:bg-blue-50' },
      }[status] || { variant: 'outline', className: '' };
  
      return (
        <Badge 
          variant={statusConfig.variant as any} 
          className={`capitalize ${statusConfig.className}`}
        >
          {row.original.status}
        </Badge>
      );
    }, 
  },
  {
    accessorKey: "totalValue",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Value" />,
    cell: ({ row }) => row.original.totalValue?.toLocaleString() ?? "-",
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];