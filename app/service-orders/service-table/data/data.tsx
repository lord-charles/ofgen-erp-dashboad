import { Building, Check, TreePine, Home, X, Clock10 } from "lucide-react";

export const statuses = [
  {
    value: "approved",
    label: "Approved",
    icon: Check,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: X,
  },
  {
    value: "pending",
    label: "Pending",
    icon: Clock10,
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
