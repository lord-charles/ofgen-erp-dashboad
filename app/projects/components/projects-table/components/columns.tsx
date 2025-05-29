"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Project, ProjectRisk } from "@/services/project.service";

const customIncludesStringFilter = (
  row: Row<Project>,
  columnId: string,
  filterValue: string
) => {
  const value = row.getValue(columnId) as string;
  return value?.toLowerCase().includes((filterValue as string).toLowerCase());
};

export const columns: ColumnDef<Project>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    id: "combinedSearch",
    header: "Search",
    accessorFn: (row) =>
      `${row?.name ?? ""} ${row?.serviceOrder?.contactInfo?.name ?? ""} ${row?.location?.name ?? ""} ${row?.projectLeader?.firstName ?? ""} ${row?.projectLeader?.lastName ?? ""}`,
    filterFn: customIncludesStringFilter,
    enableHiding: true,
    enableSorting: false,
    size: 0,
    cell: () => null,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Name" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original?.name ?? <span className="italic text-muted-foreground">N/A</span>}</span>
        <span className="text-xs text-muted-foreground">
          {(row.original?.description ?? "").split(" ").slice(0, 10).join(" ")}
        </span>
      </div>
    ),
    filterFn: customIncludesStringFilter,
  },
  {
    accessorKey: "projectLeader",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leader" />
    ),
    cell: ({ row }) => {
      const leader = row.original?.projectLeader;
      const name = [leader?.firstName, leader?.lastName].filter(Boolean).join(" ");
      return (
        <span className="font-medium">{name || <span className="italic text-muted-foreground">N/A</span>}</span>
      );
    },
  },
  {
    accessorKey: "projectType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize bg-blue-50 text-blue-800 border-blue-200">
        {row.original?.projectType ?? "-"}
      </Badge>
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Location" />
    ),
    cell: ({ row }) => {
      const loc = row.original?.location;
      const region = row.original?.serviceOrder?.locationInfo?.region;
      if (!loc || typeof loc !== 'object') {
        return <span className="italic text-muted-foreground">N/A</span>;
      }
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{loc?.name ?? <span className="italic text-muted-foreground">N/A</span>}</span>
          <div className="flex items-center gap-1">
            {loc?.county && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">{loc.county}</Badge>
            )}
            {region && (
              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">{region}</Badge>
            )}
          </div>
          {loc?.address && (
            <span className="text-xs text-muted-foreground">{loc.address}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacity" />
    ),
    cell: ({ row }) => {
      const cap = row.original?.capacity;
      const match = typeof cap === "string" ? cap.match(/(\d+(\.\d+)?)/) : null;
      const value = match ? parseFloat(match[1]) : 0;
      return (
        <span>
          {value ? `${value >= 1000 ? (value / 1000).toFixed(1) + " MW" : value + " kW"}` : <span className="italic text-muted-foreground">N/A</span>}
        </span>
      );
    },
  },
  {
    accessorKey: "contractValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contract Value" />
    ),
    cell: ({ row }) => (
      <span className="font-semibold text-green-700">
        {formatCurrency(Number(row.original?.contractValue) || 0)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Status" />
    ),
    cell: ({ row }) => {
      const status = (row.original?.status ?? "").toLowerCase();
      let badgeClass = "bg-slate-100 text-slate-700";
      if (status === "completed") badgeClass = "bg-green-100 text-green-800";
      else if (status === "in progress") badgeClass = "bg-blue-100 text-blue-800";
      else if (status === "planned") badgeClass = "bg-amber-100 text-amber-800";
      else if (status === "on hold") badgeClass = "bg-yellow-100 text-yellow-800";
      else if (status === "cancelled") badgeClass = "bg-red-100 text-red-800";
      return (
        <Badge className={badgeClass}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : <span className="italic text-muted-foreground">N/A</span>}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "progress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Progress" />
    ),
    cell: ({ row }) => {
      const progress = Number(row.original?.progress) || 0;
      return (
        <div className="flex flex-col min-w-[100px]">
          <div className="flex items-center gap-2">
            <span className="font-medium">{!isNaN(progress) ? `${progress}%` : <span className="italic text-muted-foreground">N/A</span>}</span>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "timeline",
    id: "timeline",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timeline" />
    ),
    cell: ({ row }) => {
      const start = row.original?.plannedStartDate;
      const end = row.original?.targetCompletionDate;
      return (
        <span className="text-xs">
          {formatDate(start) || <span className="italic text-muted-foreground">N/A</span>} - {formatDate(end) || <span className="italic text-muted-foreground">N/A</span>}
        </span>
      );
    },
  },
  {
    accessorKey: "risks",
    id: "risks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Risks" />
    ),
    cell: ({ row }) => {
      const risks = Array.isArray(row.original?.risks) ? row.original.risks : [];
      const highRisk = risks.some((risk: ProjectRisk) => risk?.severity?.toLowerCase() === "high" || ((risk?.probability ?? 0) * (risk?.impact ?? 0) > 6));
      return (
        <Badge variant={highRisk ? "destructive" : "secondary"} className={highRisk ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}>
          {risks.length} {highRisk ? "High" : ""}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
