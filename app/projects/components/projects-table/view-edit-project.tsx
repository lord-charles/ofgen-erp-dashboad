import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Building,
  Users,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/ui/spinner";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  projectSchema,
  ProjectFormData,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
  RiskSeverity,
} from "@/lib/project.schema";
import {
  Project,
  Subcontractor,
  updateProject,
} from "@/services/project.service";
import { User as userType } from "@/types/user";
import { getSubcontractorsBasicInfo } from "@/services/subcontractors.service";
import { getContractorBasicInfo } from "@/services/employees.service";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
}

export function ProjectDrawer({
  open,
  onOpenChange,
  project,
}: ProjectDrawerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [users, setUsers] = useState<userType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLeaderDialogOpen, setIsLeaderDialogOpen] = useState(false);
  const [isSubcontractorsDialogOpen, setIsSubcontractorsDialogOpen] =
    useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      projectType: "",
      capacity: "",
      contractValue: 0,
      priority: "Medium",
      projectLeader: "",
      subcontractors: [],
      status: "Draft",
      progress: 0,
      milestones: [],
      risks: [],
      notes: "",
      isActive: true,
    },
  });

  const steps = [
    { id: 0, title: "Basic Info", icon: Building },
    { id: 1, title: "Team & Resources", icon: Users },
    { id: 2, title: "Schedule", icon: Calendar },
    { id: 3, title: "Milestones", icon: Target },
    { id: 4, title: "Risks", icon: AlertTriangle },
    { id: 5, title: "Additional", icon: CheckCircle },
  ];

  useEffect(() => {
    if (open && project) {
      loadProjectData();
    }
  }, [open]);

  const loadProjectData = async () => {
    if (!project) return;

    setIsLoading(true);
    try {
      const [subcontractorsData, usersData] = await Promise.all([
        getSubcontractorsBasicInfo(),
        getContractorBasicInfo(),
      ]);

      setSubcontractors(subcontractorsData);
      setUsers(usersData);

      // Populate form with project data
      const formData: any = {
        ...project,
        plannedStartDate: project.plannedStartDate
          ? new Date(project.plannedStartDate)
          : undefined,
        targetCompletionDate: project.targetCompletionDate
          ? new Date(project.targetCompletionDate)
          : undefined,
        actualStartDate: project.actualStartDate
          ? new Date(project.actualStartDate)
          : undefined,
        actualCompletionDate: project.actualCompletionDate
          ? new Date(project.actualCompletionDate)
          : undefined,
        milestones:
          project.milestones?.map((milestone) => ({
            ...milestone,
            dueDate: new Date(milestone.dueDate),
            completedDate: milestone.completedDate
              ? new Date(milestone.completedDate)
              : undefined,
            tasks:
              milestone.tasks?.map((task) => ({
                ...task,
                plannedStartDate: task.plannedStartDate
                  ? new Date(task.plannedStartDate)
                  : undefined,
                plannedEndDate: task.plannedEndDate
                  ? new Date(task.plannedEndDate)
                  : undefined,
                actualStartDate: task.actualStartDate
                  ? new Date(task.actualStartDate)
                  : undefined,
                actualEndDate: task.actualEndDate
                  ? new Date(task.actualEndDate)
                  : undefined,
              })) || [],
          })) || [],
        risks:
          project.risks?.map((risk) => ({
            ...risk,
            identifiedDate: new Date(risk.identifiedDate),
            targetResolutionDate: risk.targetResolutionDate
              ? new Date(risk.targetResolutionDate)
              : undefined,
          })) || [],
      };

      form.reset(formData);
    } catch (error) {
      console.error("Error loading project data:", error);
      toast({
        title: "Error",
        description: "Failed to load project data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

function cleanObject<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== null && item !== undefined)
      .map((item) => (typeof item === "object" ? cleanObject(item) : item));
  }
  if (obj && typeof obj === "object") {
    const result: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0) &&
        !(typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
      ) {
        result[key] =
          typeof value === "object" && value !== null
            ? cleanObject(value)
            : value;
      }
    });
    return result;
  }
  return obj;
}

  const onSubmit = async (data:any) => {
    console.log("Form submitted!");
    if (!project?._id) return;

    setIsSubmitting(true);
    try {
      const updateData = {
        ...data,
        serviceOrder:
          data.serviceOrder && typeof data.serviceOrder === "object" && data.serviceOrder?._id
            ? data.serviceOrder._id
            : data.serviceOrder ?? undefined,
        location:
          data.location && typeof data.location === "object" && data.location?._id
            ? data.location._id
            : data.location ?? undefined,
        projectLeader:
          data.projectLeader && typeof data.projectLeader === "object" && data.projectLeader._id
            ? data.projectLeader._id
            : data.projectLeader ?? undefined,
        subcontractors: Array.isArray(data.subcontractors)
          ? data.subcontractors.filter(Boolean).map((s: any) =>
              s && typeof s === "object" && s._id ? s._id : s
            )
          : [],
        plannedStartDate: data.plannedStartDate ? data.plannedStartDate.toISOString() : undefined,
        targetCompletionDate: data.targetCompletionDate ? data.targetCompletionDate.toISOString() : undefined,
        actualStartDate: data.actualStartDate ? data.actualStartDate.toISOString() : undefined,
        actualCompletionDate: data.actualCompletionDate ? data.actualCompletionDate.toISOString() : undefined,
        milestones: Array.isArray(data.milestones)
          ? data.milestones.filter(Boolean).map((milestone: any) => ({
              ...milestone,
              dueDate: milestone.dueDate ? milestone.dueDate.toISOString() : undefined,
              completedDate: milestone.completedDate ? milestone.completedDate.toISOString() : undefined,
              tasks: Array.isArray(milestone.tasks)
                ? milestone.tasks.filter(Boolean).map((task: any) => ({
                    ...task,
                    plannedStartDate: task.plannedStartDate ? task.plannedStartDate.toISOString() : undefined,
                    plannedEndDate: task.plannedEndDate ? task.plannedEndDate.toISOString() : undefined,
                    actualStartDate: task.actualStartDate ? task.actualStartDate.toISOString() : undefined,
                    actualEndDate: task.actualEndDate ? task.actualEndDate.toISOString() : undefined,
                  }))
                : [],
            }))
          : [],
        risks: Array.isArray(data.risks)
          ? data.risks.filter(Boolean).map((risk: any) => ({
              ...risk,
              identifiedDate: risk.identifiedDate ? risk.identifiedDate.toISOString() : undefined,
              targetResolutionDate: risk.targetResolutionDate ? risk.targetResolutionDate.toISOString() : undefined,
            }))
          : [],
      };


      await updateProject(project?._id || "", cleanObject(updateData));

      toast({
        title: "Success!",
        description: "Project updated successfully.",
      });

      setIsEditing(false);
       setTimeout(() => {
        window.location.reload();
       }, 1000);
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const addMilestone = () => {
    const milestones = form.getValues("milestones") || [];
    form.setValue("milestones", [
      ...milestones,
      {
        name: "",
        description: "",
        dueDate: new Date(),
        progress: 0,
        tasks: [],
        deliverables: [],
      },
    ]);
  };

  const removeMilestone = (index: number) => {
    const milestones = form.getValues("milestones") || [];
    form.setValue(
      "milestones",
      milestones.filter((_, i) => i !== index)
    );
  };

  const addTask = (milestoneIndex: number) => {
    const milestones = form.getValues("milestones") || [];
    const milestone = milestones[milestoneIndex];
    if (milestone) {
      milestone.tasks = milestone.tasks || [];
      milestone.tasks.push({
        name: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        progress: 0,
        notes: "",
      });
      form.setValue("milestones", milestones);
    }
  };

  const removeTask = (milestoneIndex: number, taskIndex: number) => {
    const milestones = form.getValues("milestones") || [];
    const milestone = milestones[milestoneIndex];
    if (milestone && milestone.tasks) {
      milestone.tasks = milestone.tasks.filter((_, i) => i !== taskIndex);
      form.setValue("milestones", milestones);
    }
  };

  const addDeliverable = (milestoneIndex: number, deliverable: string) => {
    if (!deliverable.trim()) return;
    const milestones = form.getValues("milestones") || [];
    const milestone = milestones[milestoneIndex];
    if (milestone) {
      milestone.deliverables = milestone.deliverables || [];
      milestone.deliverables.push(deliverable);
      form.setValue("milestones", milestones);
    }
  };

  const removeDeliverable = (
    milestoneIndex: number,
    deliverableIndex: number
  ) => {
    const milestones = form.getValues("milestones") || [];
    const milestone = milestones[milestoneIndex];
    if (milestone && milestone.deliverables) {
      milestone.deliverables = milestone.deliverables.filter(
        (_, i) => i !== deliverableIndex
      );
      form.setValue("milestones", milestones);
    }
  };

  const addRisk = () => {
    const risks = form.getValues("risks") || [];
    form.setValue("risks", [
      ...risks,
      {
        title: "",
        description: "",
        severity: "Medium",
        status: "Open",
        identifiedDate: new Date(),
        notes: "",
      },
    ]);
  };

  const removeRisk = (index: number) => {
    const risks = form.getValues("risks") || [];
    form.setValue(
      "risks",
      risks.filter((_, i) => i !== index)
    );
  };

  if (isLoading) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading project data...</p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <ScrollArea className="space-y-4 h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="Enter project name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="e.g., Solar Power Installation"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="e.g., 25 kW"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Value (KES) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled={!isEditing}
                        placeholder="3500000"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ProjectStatus.options.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TaskPriority.options.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!isEditing}
                      placeholder="Project description and scope..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel>Service Order (Read-only)</FormLabel>
                <Input
                  value={project?.serviceOrder?.siteDetails?.siteId || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Location (Read-only)</FormLabel>
                <Input
                  value={project?.location?.name || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="h-10" />
          </ScrollArea>
        );

      case 1: // Team & Resources
        return (
          <ScrollArea className="gap-y-4 h-[60vh]">
            <FormField
              control={form.control}
              name="projectLeader"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Project Leader</FormLabel>
                  <Dialog
                    open={isLeaderDialogOpen}
                    onOpenChange={setIsLeaderDialogOpen}
                  >
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!isEditing}
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        type="button"
                        onClick={() => setIsLeaderDialogOpen(true)}
                      >
                        {field.value
                          ? users?.find((user) => user?._id === field.value)
                              ?.firstName|| project?.projectLeader?.firstName || "Select project leader"
                          : "Select project leader"}{" "}
                        {field.value
                          ? users?.find((user) => user?._id === field.value)
                              ?.lastName || project?.projectLeader?.lastName || ""
                          : ""}
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                    <DialogContent className="h-[400px]">
                      <DialogHeader>
                        <DialogTitle>Select Project Leader</DialogTitle>
                        <DialogDescription>
                          Search and select a user to assign as project leader.
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-[300px]">
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {users?.map((user) => (
                              <CommandItem
                                value={`${user?.firstName} ${user?.lastName}`}
                                key={user?._id}
                                onSelect={() => {
                                  form.setValue("projectLeader", user?._id);
                                  setIsLeaderDialogOpen(false);
                                }}
                              >
                                <CheckCircle
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    user?._id === field?.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div>
                                  <div className="font-medium">
                                    {user?.firstName} {user?.lastName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {user?.email}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-5" />
            <FormField
              control={form.control}
              name="subcontractors"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Subcontractors *</FormLabel>
                  <Dialog
                    open={isSubcontractorsDialogOpen}
                    onOpenChange={setIsSubcontractorsDialogOpen}
                  >
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="justify-between"
                        type="button"
                        onClick={() => setIsSubcontractorsDialogOpen(true)}
                        disabled={!isEditing}
                      >
                        {Array.isArray(field.value) && field.value.length > 0
                          ? `${field.value.length} subcontractor(s) selected`
                          : "Select subcontractors"}
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                    <DialogContent className="h-[400px]">
                      <DialogHeader>
                        <DialogTitle>Select Subcontractors</DialogTitle>
                        <DialogDescription>
                          Select one or more subcontractors for this project.
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-[300px]">
                        <Command>
                          <CommandInput placeholder="Search subcontractors..." />
                          <CommandEmpty>No subcontractor found.</CommandEmpty>
                          <CommandGroup>
                            {subcontractors?.map((subcontractor) => (
                              <CommandItem
                                value={
                                  subcontractor?.companyName ||
                                  `${subcontractor?.firstName} ${subcontractor?.lastName}`
                                }
                                key={subcontractor?._id}
                                onSelect={() => {
                                  const currentValue = Array.isArray(
                                    field.value
                                  )
                                    ? field.value
                                    : [];
                                  const newValue = currentValue.includes(
                                    subcontractor?._id || ""
                                  )
                                    ? currentValue.filter(
                                        (id) => id !== subcontractor?._id || ""
                                      )
                                    : [
                                        ...currentValue,
                                        subcontractor?._id || "",
                                      ];
                                  form.setValue("subcontractors", newValue);
                                }}
                              >
                                <CheckCircle
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    Array.isArray(field.value) &&
                                      field.value.includes(
                                        subcontractor?._id || ""
                                      )
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div>
                                  <div className="font-medium">
                                    {subcontractor?.companyName ||
                                      `${subcontractor?.firstName} ${subcontractor?.lastName}`}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {subcontractor?.email}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </ScrollArea>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          onClick={() => setIsSubcontractorsDialogOpen(false)}
                        >
                          Done
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {Array.isArray(field.value) && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((id) => {
                        const subcontractor = subcontractors?.find(
                          (s) => s?._id === id
                        );
                        return (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="px-3 py-1 flex items-center gap-1"
                          >
                            <span>
                              {subcontractor?.companyName ||
                                `${subcontractor?.firstName || ""} ${
                                  subcontractor?.lastName || ""
                                }`}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 rounded-full"
                              onClick={() => {
                                const newValue = Array.isArray(field.value)
                                  ? field.value.filter((subId) => subId !== id)
                                  : [];
                                form.setValue("subcontractors", newValue);
                              }}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}

{project?.subcontractors && project?.subcontractors?.length > 0 && (
                 <ScrollArea className="h-[100px]">
                  <FormDescription>
                      {project?.subcontractors?.length} Subcontractors in the project
                    </FormDescription>
                    {project?.subcontractors?.map((subcontractor,index) => (
                      <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 flex items-center gap-1 mt-1"
                    >
                      <span>
                        {subcontractor?.companyName ||
                          `${subcontractor?.firstName || ""} ${
                            subcontractor?.lastName || ""
                          }`}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 rounded-full"
                        onClick={() => {
                          const newValue = Array.isArray(field.value)
                            ? field.value.filter((subId) => subId !== subcontractor?._id)
                            : [];
                          form.setValue("subcontractors", newValue);
                        }}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                    ))}
                  </ScrollArea>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-10" />
          </ScrollArea>
        );

      case 2: // Schedule
        return (
          <ScrollArea className="space-y-4 h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="plannedStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Planned Start Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={!isEditing}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetCompletionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Target Completion Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={!isEditing}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actualStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Actual Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={!isEditing}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actualCompletionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Actual Completion Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={!isEditing}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="progress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      disabled={!isEditing}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-10" />
          </ScrollArea>
        );

      case 3: // Milestones
        const milestones = form.watch("milestones") || [];
        return (
          <ScrollArea className="space-y-4 h-[60vh]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Project Milestones</h3>
              {isEditing && (
                <Button onClick={addMilestone} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              )}
            </div>

            {milestones.map((milestone, milestoneIndex) => (
              <Card key={milestoneIndex}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Milestone {milestoneIndex + 1}
                    </CardTitle>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMilestone(milestoneIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`milestones.${milestoneIndex}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Milestone Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing}
                              placeholder="Enter milestone name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`milestones.${milestoneIndex}.dueDate`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  disabled={!isEditing}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`milestones.${milestoneIndex}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={!isEditing}
                            placeholder="Milestone description..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`milestones.${milestoneIndex}.progress`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Progress (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            disabled={!isEditing}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Deliverables Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Deliverables</FormLabel>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const deliverable = prompt("Enter deliverable:");
                            if (deliverable) {
                              addDeliverable(milestoneIndex, deliverable);
                            }
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Deliverable
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {milestone.deliverables?.map(
                        (deliverable, deliverableIndex) => (
                          <Badge
                            key={deliverableIndex}
                            variant="outline"
                            className="relative group"
                          >
                            {deliverable}
                            {isEditing && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() =>
                                  removeDeliverable(
                                    milestoneIndex,
                                    deliverableIndex
                                  )
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  {/* Tasks Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Tasks</FormLabel>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addTask(milestoneIndex)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      )}
                    </div>

                    {milestone.tasks?.map((task, taskIndex) => (
                      <Card key={taskIndex} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Task {taskIndex + 1}</h4>
                          {isEditing && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeTask(milestoneIndex, taskIndex)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`milestones.${milestoneIndex}.tasks.${taskIndex}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Task Name *</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={!isEditing}
                                    placeholder="Enter task name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`milestones.${milestoneIndex}.tasks.${taskIndex}.assignedSubcontractor`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assigned To</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={!isEditing}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select subcontractor" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {subcontractors.map((sub, key) => (
                                      <SelectItem
                                        key={key}
                                        value={sub?._id || ""}
                                      >
                                        {sub?.companyName ||
                                          `${sub?.firstName} ${sub?.lastName}`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`milestones.${milestoneIndex}.tasks.${taskIndex}.status`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={!isEditing}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {TaskStatus.options.map((status) => (
                                      <SelectItem key={status} value={status}>
                                        {status}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`milestones.${milestoneIndex}.tasks.${taskIndex}.priority`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={!isEditing}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {TaskPriority.options.map((priority) => (
                                      <SelectItem
                                        key={priority}
                                        value={priority}
                                      >
                                        {priority}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`milestones.${milestoneIndex}.tasks.${taskIndex}.description`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder="Task description..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name={`milestones.${milestoneIndex}.tasks.${taskIndex}.plannedStartDate`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Planned Start Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        disabled={!isEditing}
                                        className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <CalendarComponent
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                      className="p-3 pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`milestones.${milestoneIndex}.tasks.${taskIndex}.plannedEndDate`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Planned End Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        disabled={!isEditing}
                                        className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <CalendarComponent
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                      className="p-3 pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`milestones.${milestoneIndex}.tasks.${taskIndex}.progress`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Progress (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  {...field}
                                  disabled={!isEditing}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {milestones.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No milestones added yet.{" "}
                {isEditing && 'Click "Add Milestone" to get started.'}
              </div>
            )}
            <div className="h-10" />
          </ScrollArea>
        );

      case 4: // Risks
        const risks = form.watch("risks") || [];
        return (
          <ScrollArea className="space-y-4 h-[60vh]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Project Risks</h3>
              {isEditing && (
                <Button onClick={addRisk} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Risk
                </Button>
              )}
            </div>

            {risks.map((risk, riskIndex) => (
              <Card key={riskIndex}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Risk {riskIndex + 1}
                    </CardTitle>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRisk(riskIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`risks.${riskIndex}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risk Title *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing}
                              placeholder="Enter risk title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`risks.${riskIndex}.severity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {RiskSeverity.options.map((severity) => (
                                <SelectItem key={severity} value={severity}>
                                  {severity}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`risks.${riskIndex}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={!isEditing}
                            placeholder="Risk description..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`risks.${riskIndex}.mitigationPlan`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mitigation Plan</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={!isEditing}
                            placeholder="Risk mitigation plan..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}

            {risks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No risks identified yet.{" "}
                {isEditing && 'Click "Add Risk" to get started.'}
              </div>
            )}
            <div className="h-10" />
          </ScrollArea>
        );

      case 5: // Additional
        return (
          <ScrollArea className="space-y-4 h-[60vh]">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!isEditing}
                      placeholder="Additional project notes..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {project?.createdAt && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <FormLabel>Created At</FormLabel>
                  <Input
                    value={format(new Date(project.createdAt), "PPP p")}
                    disabled
                    className="bg-muted"
                  />
                </div>
                {project.updatedAt && (
                  <div className="space-y-2">
                    <FormLabel>Last Updated</FormLabel>
                    <Input
                      value={format(new Date(project.updatedAt), "PPP p")}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                )}
              </div>
            )}
            <div className="h-10" />
          </ScrollArea>
        );

      default:
        return null;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[96vh]">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {project?.name || "Project Details"}
              </DrawerTitle>
              <DrawerDescription>
                {isEditing
                  ? "Edit project information"
                  : "View project details"}
              </DrawerDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    loadProjectData(); // Reset form to original values
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4">
          {/* Step Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 p-2 bg-muted rounded-lg">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Button
                  key={step.id}
                  variant={currentStep === step.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentStep(step.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {step.title}
                </Button>
              );
            })}
          </div>
          <Form {...form}>
            <div className="min-h-[400px]">{renderStepContent()}</div>

            {isEditing && (
              <div className="flex justify-end gap-2 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    loadProjectData();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    console.log("submitting");
                    onSubmit(form.getValues());
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Spinner />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
