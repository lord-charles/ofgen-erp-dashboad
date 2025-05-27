"use client";
import { Card } from "@/components/ui/card";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Location } from "@/types/location";

interface LocationsTableProps {
  data: Location[];
}

export default function LocationsTable({ data }: LocationsTableProps) {
  return (
    <Card className="p-2">
      <DataTable data={data} columns={columns} />
    </Card>
  );
}
