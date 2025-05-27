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
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.status}
      </Badge>
    ),
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