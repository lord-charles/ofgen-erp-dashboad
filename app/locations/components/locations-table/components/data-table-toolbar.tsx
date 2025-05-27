"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Location } from "@/types/location";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { Download } from "lucide-react";
import { saveAs } from "file-saver";
import json2csv from "json2csv";
import { format } from "date-fns";
import { siteTypes, statuses } from "../data/data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleExport = () => {
    const filteredData = table.getFilteredRowModel().rows.map((row) => {
      const original = row.original as Location;
      return {
        Name: original.name || "N/A",
        County: original.county || "N/A",
        Address: original.address || "N/A",
        Latitude: original.coordinates?.lat ?? "N/A",
        Longitude: original.coordinates?.lng ?? "N/A",
        "Site Type": original.siteType || "N/A",
        "Site ID": original.siteId || "N/A",
        "System Site ID": original.systemSiteId || "N/A",
        Status: original.status ? original.status.charAt(0).toUpperCase() + original.status.slice(1) : "N/A",
      };
    });
    const fields = [
      "Name",
      "County",
      "Address",
      "Latitude",
      "Longitude",
      "Site Type",
      "Site ID",
      "System Site ID",
      "Status",
    ];
    const opts = { fields };
    const csvData = json2csv.parse(filteredData, opts);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm");
    saveAs(blob, `locations_export_${timestamp}.csv`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search locations..."
          value={(table.getColumn("combinedName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            const combinedColumn = table.getColumn("combinedName");
            if (combinedColumn) {
              combinedColumn.setFilterValue(value);
            }
          }}
          className="h-8 w-[150px] lg:w-[350px]"
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("siteType") && (
          <DataTableFacetedFilter
            column={table.getColumn("siteType")}
            title="Site Type"
            options={siteTypes}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button className="h-8" variant="outline" onClick={handleExport}>
          Export <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default DataTableToolbar;
