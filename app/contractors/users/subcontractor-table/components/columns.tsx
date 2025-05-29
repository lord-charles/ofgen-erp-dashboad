"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Subcontractor } from "@/services/subcontractors.service";

const customIncludesStringFilter = (
  row: Row<Subcontractor>,
  columnId: string,
  filterValue: string
) => {
  const value = row.getValue(columnId) as string;
  return value?.toLowerCase().includes((filterValue as string).toLowerCase());
};



export const columns: ColumnDef<Subcontractor>[] = [

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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name / Company Name" />,
    cell: ({ row }) => {
      const firstName = row.original.firstName || "";
      const lastName = row.original.lastName || "";
      return (
        <>
        <span className="font-normal text-sm capitalize">{`${firstName} ${lastName}`.trim()}</span>
       <div> {row.original.isCompany && row.original.companyName && <span className="font-medium capitalize">{row.original.companyName}</span>}</div>
        </>
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
    cell: ({ row }) => <span>{row.original.phone || ""}</span>,
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
      const status = row.original.isActive ? "Active" : "Inactive";
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      if (status === "Active") variant = "secondary";
      else if (status === "Inactive") variant = "destructive";
      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "specialty",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Specialty" />,
    cell: ({ row }) => <span>{row.original.specialty || ""}</span>,
  },

{
  accessorKey: "actions",
cell: ({ row }) => <DataTableRowActions row={row} />,
},
];
