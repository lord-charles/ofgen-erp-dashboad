"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";

const customIncludesStringFilter = (
  row: Row<User>,
  columnId: string,
  filterValue: string
) => {
  const value = row.getValue(columnId) as string;
  return value?.toLowerCase().includes((filterValue as string).toLowerCase());
};



export const columns: ColumnDef<User>[] = [

  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) => {
      return `${row.firstName} ${row.lastName}`;
    },
    filterFn: customIncludesStringFilter,
    enableHiding: true,
    enableSorting: false,
    size: 0,
    cell: () => null,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const firstName = row.original.firstName || "";
      const lastName = row.original.lastName || "";
      return (
        <span className="font-medium capitalize">{`${firstName} ${lastName}`.trim()}</span>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <span>{row.original.email || ""}</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone Number" />,
    cell: ({ row }) => <span>{row.original.phoneNumber || ""}</span>,
  },
  {
    accessorKey: "nationalId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="National ID" />,
    cell: ({ row }) => <span>{row.original.nationalId || ""}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status || "";
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      if (status === "active") variant = "secondary";
      else if (status === "pending") variant = "outline";
      else if (status === "inactive") variant = "destructive";
      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "employeeId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employee ID" />,
    cell: ({ row }) => <span>{row.original.employeeId || ""}</span>,
  },
  {
    accessorKey: "position",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
    cell: ({ row }) => <span>{row.original.position || ""}</span>,
  },

{
  accessorKey: "actions",
cell: ({ row }) => <DataTableRowActions row={row} />,
},
];
