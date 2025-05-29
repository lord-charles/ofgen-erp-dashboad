import {
  PlayCircleIcon,
  PauseCircleIcon,
  StopCircleIcon,
  XCircleIcon,
  CheckCircleIcon,

} from "lucide-react";

export const statuses = [
  {
    value: "In Progress",
    label: "In Progress",
    icon: PlayCircleIcon,
    color: "#33FF57", 
    textColor: "#000000",
  },
  {
    value: "Planned",
    label: "Planned",
    icon: PauseCircleIcon,
    color: "#33FF57", 
    textColor: "#000000",
  },
  {
    value: "On Hold",
    label: "On Hold",
    icon: StopCircleIcon,
    color: "#33FF57", 
    textColor: "#000000",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: XCircleIcon,
    color: "#33FF57", 
    textColor: "#000000",
  },
  {
    value: "Completed",
    label: "Completed",
    icon: CheckCircleIcon,
    color: "#33FF57", 
    textColor: "#000000",
  },
 
];
