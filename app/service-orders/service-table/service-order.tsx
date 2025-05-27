"use client";
import { Card } from "@/components/ui/card";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { ServiceOrder } from "../types/service-order";

interface ServiceOrderTableProps {
  data: ServiceOrder[];
}

export default function ServiceOrderTable({ data }: ServiceOrderTableProps) {
  return (
    <Card className="p-2">
      <DataTable data={data} columns={columns} />
    </Card>
  );
}
