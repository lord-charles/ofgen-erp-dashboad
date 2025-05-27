import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin, Building, TreePine, Home } from "lucide-react";
import { DataTableRowActions } from "./data-table-row-actions";
import { Location } from "@/types/location";

const customIncludesStringFilter = (
  row: any,
  columnId: string,
  filterValue: string
) => {
  const searchValue = String(row.getValue(columnId) || "").toLowerCase();
  return searchValue.includes(filterValue.toLowerCase());
};

export const columns: ColumnDef<Location, any>[] = [
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) =>
      `${row.name || ""} ${row.county || ""} ${row.address || ""} ${row.siteId || ""} ${row.systemSiteId || ""}`,
    filterFn: customIncludesStringFilter,
    enableHiding: true,
    enableSorting: false,
    size: 0,
    cell: () => null,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => {
      const name = row.original.name;
      const address = row.original.address;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="space-y-2 cursor-pointer">
              <div className="font-semibold truncate max-w-[250px]">{name}</div>
              <div className="text-sm text-muted-foreground truncate max-w-[250px]">{address}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col">
              <span className="font-semibold">{name}</span>
              <span className="text-xs text-muted-foreground">{address}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "county",
    header: ({ column }) => <DataTableColumnHeader column={column} title="County" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-400" />
        <span>{row.original.county}</span>
      </div>
    ),
  },
  {
    accessorKey: "siteType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Site Type" />,
    cell: ({ row }) => {
      const siteType = row.getValue("siteType") as Location['siteType'];
      return (
        <Badge
          variant="outline"
          className={`flex items-center gap-1 ${(() => {
            switch (siteType) {
              case 'indoor':
                return 'bg-blue-100 text-blue-800';
              case 'outdoor':
                return 'bg-green-100 text-green-800';
              case 'rooftop':
                return 'bg-purple-100 text-purple-800';
              case 'ground':
                return 'bg-amber-100 text-amber-800';
              default:
                return 'bg-gray-100 text-gray-800';
            }
          })()}`}
        >
          {(() => {
            switch (siteType) {
              case 'indoor':
                return <Building className="h-3 w-3" />;
              case 'outdoor':
                return <TreePine className="h-3 w-3" />;
              case 'rooftop':
                return <Home className="h-3 w-3" />;
              case 'ground':
                return <MapPin className="h-3 w-3" />;
              default:
                return null;
            }
          })()} {siteType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as Location['status'];
      return (
        <Badge
          variant="outline"
          className={`capitalize ${(() => {
            switch (status) {
              case 'active':
                return 'bg-emerald-100 text-emerald-800';
              case 'inactive':
                return 'bg-red-100 text-red-800';
              case 'maintenance':
                return 'bg-amber-100 text-amber-800';
              case 'pending':
                return 'bg-blue-100 text-blue-800';
              default:
                return 'bg-gray-100 text-gray-800';
            }
          })()}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "coordinates",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Coordinates" />,
    cell: ({ row }) => {
      const coords = row.original.coordinates;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="font-medium">
                {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "N/A"}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Latitude: {coords?.lat.toFixed(6)}</p>
            <p>Longitude: {coords?.lng.toFixed(6)}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "siteId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Site IDs" />,
    cell: ({ row }) => {
      const siteId = row.getValue("siteId") as string;
      const systemSiteId = row.original.systemSiteId;
      return (

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="space-y-1">
              {siteId && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                  {siteId}
                </Badge>
              )}
              {systemSiteId && (
                <div className="bg-purple-50 text-purple-700 rounded line-clamp-1 text-[8px]">
                  {systemSiteId}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Site ID: {siteId || "N/A"}</p>
            <p>System Site ID: {systemSiteId || "N/A"}</p>
          </TooltipContent>
        </Tooltip>

      );
    },
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];