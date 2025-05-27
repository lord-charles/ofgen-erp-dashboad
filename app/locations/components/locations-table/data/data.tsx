import { Building, Wrench, Zap, TreePine, Home } from "lucide-react";

export const statuses = [
  {
    value: "active",
    label: "Active",
    icon: Zap,
  },
  {
    value: "inactive",
    label: "Inactive",
    icon: Building,
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: Wrench,
  },
  {
    value: "pending",
    label: "Pending",
    icon: Zap,
  },
];

export const siteTypes = [
  {
    value: "outdoor",
    label: "Outdoor",
    icon: TreePine,
  },
  {
    value: "indoor",
    label: "Indoor",
    icon: Building,
  },
  {
    value: "rooftop",
    label: "Rooftop",
    icon: Home,
  },
  {
    value: "ground",
    label: "Ground",
    icon: Building,
  },
];
