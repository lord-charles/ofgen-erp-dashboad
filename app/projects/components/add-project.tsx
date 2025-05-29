
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle, Circle, Users, Calendar, Building, FileText, X, Flag as FlagIcon, AlertTriangle } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createProject, Subcontractor } from '@/services/project.service';
import { User } from '@/types/user';
import { getContractorBasicInfo } from '@/services/employees.service';
import { getSubcontractorsBasicInfo } from '@/services/subcontractors.service';
import { getServiceOrdersBasicInfo } from '@/services/service-order-service';
import { getBasicLocationInfo } from '@/services/location-service';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/ui/spinner';

// Define milestone schema
const milestoneSchema = z.object({
    name: z.string().min(1, 'Milestone name is required'),
    description: z.string().optional(),
    dueDate: z.date({
        required_error: 'Due date is required',
    }),
    completedDate: z.date().optional(),
    progress: z.number().min(0).max(100).default(0),
    deliverables: z.array(z.string()).optional().default([]),
});

// Define risk schema
const riskSchema = z.object({
    title: z.string().min(1, 'Risk title is required'),
    description: z.string().optional(),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
    probability: z.number().min(0).max(1).optional(),
    impact: z.number().min(1).max(10).optional(),
    mitigationPlan: z.string().optional(),
    status: z.string().default('Open'),
    identifiedDate: z.date().default(() => new Date()),
    targetResolutionDate: z.date().optional(),
    notes: z.string().optional(),
});

export const projectSchema = z.object({
    // Basic Information
    name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
    projectType: z.string().min(1, 'Project type is required'),
    capacity: z.string().min(1, 'Capacity is required'),
    contractValue: z.number().min(1, 'Contract value must be greater than 0'),
    priority: z.enum(['Low', 'Medium', 'High'], {
        errorMap: () => ({ message: 'Priority is required' })
    }),

    // People & Resources
    projectLeader: z.string().optional(),
    subcontractors: z.array(z.string()).optional().default([]),

    // Dates & Schedule
    plannedStartDate: z.date({
        required_error: 'Planned start date is required',
    }),
    targetCompletionDate: z.date({
        required_error: 'Target completion date is required',
    }),
    
    // Milestones & Risks
    milestones: z.array(milestoneSchema).optional().default([]),
    risks: z.array(riskSchema).optional().default([]),

    // Optional fields with defaults
    serviceOrder: z.string().optional(),
    location: z.string().optional(),
    status: z.string().default('Draft'),
    progress: z.number().min(0).max(100).default(0),
    notes: z.string().optional(),
    isActive: z.boolean().default(true),
}).refine((data) => {
    return data.targetCompletionDate > data.plannedStartDate;
}, {
    message: "Target completion date must be after planned start date",
    path: ["targetCompletionDate"],
});

export type ProjectFormData = z.infer<typeof projectSchema>;

interface CreateProjectDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const steps = [
    {
        id: 'basic',
        title: 'Basic Information',
        description: 'Project details and description',
        icon: Building,
    },
    {
        id: 'team',
        title: 'Team & Resources',
        description: 'Assign team members and subcontractors',
        icon: Users,
    },
    {
        id: 'schedule',
        title: 'Schedule & Timeline',
        description: 'Set project dates and timeline',
        icon: Calendar,
    },
    {
        id: 'milestones',
        title: 'Milestones',
        description: 'Define key project milestones',
        icon: FlagIcon,
    },
    {
        id: 'risks',
        title: 'Risk Management',
        description: 'Identify potential risks and mitigation',
        icon: AlertTriangle,
    },
    {
        id: 'review',
        title: 'Review & Submit',
        description: 'Review all details before creating',
        icon: FileText,
    },
];

// Define interfaces for service orders and locations
interface ServiceOrder {
    _id: string;
    issuedBy: string;
    issuedTo: string;
    serviceOrderDate: string;
    status: string;
}

interface Location {
    _id: string;
    name: string;
    siteId: string;
    systemSiteId: string;
}

export function CreateProjectDrawer({ open, onOpenChange }: CreateProjectDrawerProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const [isLeaderDialogOpen, setIsLeaderDialogOpen] = useState(false);
    const [isSubcontractorsDialogOpen, setIsSubcontractorsDialogOpen] = useState(false);
    const [isServiceOrderDialogOpen, setIsServiceOrderDialogOpen] = useState(false);
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);


    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: '',
            description: '',
            projectType: '',
            capacity: '',
            contractValue: 0,
            priority: 'Medium',
            projectLeader: '',
            subcontractors: [],
            status: 'Draft',
            progress: 0,
            notes: '',
            isActive: true,
        },
    });

    useEffect(() => {
        if (open) {
            loadData();
        }
    }, [open]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [subcontractorsData, usersData, serviceOrdersData, locationsData] = await Promise.all([
                getSubcontractorsBasicInfo(),
                getContractorBasicInfo(),
                getServiceOrdersBasicInfo(),
                getBasicLocationInfo(),
            ]);
            setSubcontractors(subcontractorsData);
            setUsers(usersData);
            setServiceOrders(serviceOrdersData);
            setLocations(locationsData);
        } catch (error) {
            console.error('Error loading data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load data. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = async () => {
    // Don't proceed if we're already on the last step
    if (currentStep >= steps.length - 1) return;
    
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
        setCurrentStep(currentStep + 1);
    }
};

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const getFieldsForStep = (step: number): (keyof ProjectFormData)[] => {
        switch (step) {
            case 0:
                return ['name', 'description', 'projectType', 'capacity', 'serviceOrder', 'location', 'contractValue', 'priority'];
            case 1:
                return ['projectLeader', 'subcontractors'];
            case 2:
                return ['plannedStartDate', 'targetCompletionDate', 'notes'];
            case 3:
                return ['milestones'];
            case 4:
                return ['risks'];
            default:
                return [];
        }
    };

    const onSubmit = async (data: ProjectFormData) => {
    // Form will only be submitted when the Create Project button is clicked
        setIsSubmitting(true);
        try {
            console.log('Submitting project data:', data);

            const projectPayload = {
                name: data.name,
                description: data.description,
                projectType: data.projectType,
                capacity: data.capacity,
                contractValue: data.contractValue,
                priority: data.priority,
                projectLeader: data.projectLeader,
                subcontractors: data.subcontractors,
                plannedStartDate: data.plannedStartDate.toISOString(),
                targetCompletionDate: data.targetCompletionDate.toISOString(),
                status: data.status,
                progress: data.progress,
                notes: data.notes || '',
                isActive: data.isActive,
                serviceOrder: data.serviceOrder,
                location: data.location,
                milestones: data.milestones || [],
                risks: data.risks || [],
            };

            await createProject(projectPayload);

            toast({
                title: 'Success!',
                description: 'Project created successfully.',
            });

            form.reset();
            setCurrentStep(0);
            setTimeout(() => {
                onOpenChange(false);
                window.location.reload(); 
            }, 1500);
        } catch (error) {
            console.error('Error creating project:', error);
            toast({
                title: 'Error',
                description:
                        error instanceof Error
                          ? error.message
                          : "Failed to create project. Please try again.",
                      variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Use field arrays for milestones and risks for better state management
    const { fields: milestoneFields, append: appendMilestone, remove: removeMilestone } = useFieldArray({
        control: form.control,
        name: "milestones",
    });
    
    const { fields: riskFields, append: appendRisk, remove: removeRisk } = useFieldArray({
        control: form.control,
        name: "risks",
    });
    
    // Function to add a new milestone to the form
    const addMilestone = () => {
        appendMilestone({
            name: '',
            description: '',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            progress: 0,
            deliverables: [],
        });
    };
    
    // Function to add a new risk to the form
    const addRisk = () => {
        appendRisk({
            title: '',
            description: '',
            severity: 'Medium',
            status: 'Open',
            identifiedDate: new Date(),
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Kitengela Solar Power Installation" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the project scope, objectives, and key deliverables..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a detailed description of the project (minimum 10 characters)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="projectType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Type *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select project type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Solar Power Installation">Solar Power Installation</SelectItem>
                                                <SelectItem value="Wind Energy Project">Wind Energy Project</SelectItem>
                                                <SelectItem value="Electrical Infrastructure">Electrical Infrastructure</SelectItem>
                                                <SelectItem value="Maintenance & Repair">Maintenance & Repair</SelectItem>
                                                <SelectItem value="Consulting Services">Consulting Services</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                            <Input placeholder="e.g., 25 kW" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="serviceOrder"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Service Order *</FormLabel>
                                        <Dialog open={isServiceOrderDialogOpen} onOpenChange={setIsServiceOrderDialogOpen}>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    type="button"
                                                    onClick={() => setIsServiceOrderDialogOpen(true)}
                                                >
                                                    {field.value
                                                        ? serviceOrders?.find((so) => so?._id === field.value)?.issuedBy || "Select service order"
                                                        : "Select service order"}
                                                    <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            <DialogContent className='h-[400px]'>
                                                <DialogHeader>
                                                    <DialogTitle>Select Service Order</DialogTitle>
                                                    <DialogDescription>Choose the service order for this project.</DialogDescription>
                                                </DialogHeader>
                                                <ScrollArea className="h-[300px]">
                                                    <Command>
                                                        <CommandInput placeholder="Search service orders..." />
                                                        <CommandEmpty>No service order found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {serviceOrders?.map((so) => (
                                                                <CommandItem
                                                                    value={so?.issuedBy}
                                                                    key={so?._id}
                                                                    onSelect={() => {
                                                                        form.setValue("serviceOrder", so?._id);
                                                                        setIsServiceOrderDialogOpen(false);
                                                                    }}
                                                                >
                                                                    <CheckCircle
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            so?._id === field?.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div>
                                                                        <div className="font-medium">{so?.issuedBy}</div>
                                                                        <div className="text-sm text-muted-foreground">
                                                                            {format(new Date(so?.serviceOrderDate), "PPP")} • {so?.status}
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

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Location *</FormLabel>
                                        <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    type="button"
                                                    onClick={() => setIsLocationDialogOpen(true)}
                                                >
                                                    {field.value
                                                        ? locations?.find((loc) => loc?._id === field.value)?.name || "Select location"
                                                        : "Select location"}
                                                    <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            <DialogContent className='h-[400px]'>
                                                <DialogHeader>
                                                    <DialogTitle>Select Location</DialogTitle>
                                                    <DialogDescription>Choose the project location or site.</DialogDescription>
                                                </DialogHeader>
                                                <ScrollArea className="h-[300px]">
                                                    <Command>
                                                        <CommandInput placeholder="Search locations..." />
                                                        <CommandEmpty>No location found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {locations?.map((loc) => (
                                                                <CommandItem
                                                                    value={loc?.name}
                                                                    key={loc?._id}
                                                                    onSelect={() => {
                                                                        form.setValue("location", loc?._id);
                                                                        setIsLocationDialogOpen(false);
                                                                    }}
                                                                    className='mt-1'
                                                                >
                                                                    <CheckCircle
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            loc?._id === field?.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div>
                                                                        <div className="font-medium">{loc?.name}</div>
                                                                        <div className="text-sm text-muted-foreground">
                                                                            Site ID: {loc?.siteId || 'N/A'} • System ID: {loc?.systemSiteId || 'N/A'}
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contractValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contract Value (KES) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="3500000"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Low">Low</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="projectLeader"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Project Leader *</FormLabel>
                                    <Dialog open={isLeaderDialogOpen} onOpenChange={setIsLeaderDialogOpen}>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                type="button"
                                                onClick={() => setIsLeaderDialogOpen(true)}
                                            >
                                                {field.value
                                                    ? users?.find((user) => user?._id === field.value)?.firstName || "Select project leader"
                                                    : "Select project leader"}
                                                    {" "}
                                                {field.value
                                                    ? users?.find((user) => user?._id === field.value)?.lastName || ""
                                                    : ""}
                                                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        <DialogContent className='h-[400px]'>
                                            <DialogHeader>
                                                <DialogTitle>Select Project Leader</DialogTitle>
                                                <DialogDescription>Search and select a user to assign as project leader.</DialogDescription>
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
                                                                    <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                                                                    <div className="text-sm text-muted-foreground">{user?.email}</div>
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

                        <FormField
                            control={form.control}
                            name="subcontractors"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Subcontractors *</FormLabel>
                                    <Dialog open={isSubcontractorsDialogOpen} onOpenChange={setIsSubcontractorsDialogOpen}>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="justify-between"
                                                type="button"
                                                onClick={() => setIsSubcontractorsDialogOpen(true)}
                                            >
                                                {Array.isArray(field.value) && field.value.length > 0
                                                    ? `${field.value.length} subcontractor(s) selected`
                                                    : "Select subcontractors"}
                                                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        <DialogContent className='h-[400px]'>
                                            <DialogHeader>
                                                <DialogTitle>Select Subcontractors</DialogTitle>
                                                <DialogDescription>Select one or more subcontractors for this project.</DialogDescription>
                                            </DialogHeader>
                                            <ScrollArea className="h-[300px]">
                                                <Command>
                                                    <CommandInput placeholder="Search subcontractors..." />
                                                    <CommandEmpty>No subcontractor found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {subcontractors?.map((subcontractor) => (
                                                            <CommandItem
                                                                value={subcontractor?.companyName || `${subcontractor?.firstName} ${subcontractor?.lastName}`}
                                                                key={subcontractor?._id}
                                                                onSelect={() => {
                                                                    const currentValue = Array.isArray(field.value) ? field.value : [];
                                                                    const newValue = currentValue.includes(subcontractor?._id || "")
                                                                        ? currentValue.filter((id) => id !== subcontractor?._id || "")
                                                                        : [...currentValue, subcontractor?._id || ""];
                                                                    form.setValue("subcontractors", newValue);
                                                                }}
                                                            >
                                                                <CheckCircle
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        Array.isArray(field.value) && field.value.includes(subcontractor?._id || "")
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {subcontractor?.companyName || `${subcontractor?.firstName} ${subcontractor?.lastName}`}
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">{subcontractor?.email}</div>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </ScrollArea>
                                            <div className="flex justify-end mt-4">
                                                <Button type="button" onClick={() => setIsSubcontractorsDialogOpen(false)}>
                                                    Done
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    {Array.isArray(field.value) && field.value.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {field.value.map((id) => {
                                                const subcontractor = subcontractors?.find((s) => s?._id === id);
                                                return (
                                                    <Badge 
                                                        key={id} 
                                                        variant="secondary"
                                                        className="px-3 py-1 flex items-center gap-1"
                                                    >
                                                        <span>
                                                            {subcontractor?.companyName || `${subcontractor?.firstName || ''} ${subcontractor?.lastName || ''}`}
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-5 w-5 p-0 rounded-full"
                                                            onClick={() => {
                                                                const newValue = Array.isArray(field.value) 
                                                                    ? field.value.filter(subId => subId !== id)
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
                                    <FormDescription>
                                        Select at least one subcontractor for this project
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
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
                                                    disabled={(date) => date < new Date()}
                                                    initialFocus
                                                    className={cn("p-3 pointer-events-auto")}
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
                                                    disabled={(date) => {
                                                        const startDate = form.getValues('plannedStartDate');
                                                        return date < new Date() || (startDate && date <= startDate);
                                                    }}
                                                    initialFocus
                                                    className={cn("p-3 pointer-events-auto")}
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
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any additional information, special requirements, or notes..."
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Optional notes about the project
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                );
                
            case 3: // Milestones step
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Project Milestones</h3>
                            <Button 
                                type="button" 
                                onClick={addMilestone}
                                size="sm"
                            >
                                Add Milestone
                            </Button>
                        </div>
                        
                        <div className="space-y-6">
                            {milestoneFields.length === 0 ? (
                                <div className="text-center py-8 bg-muted/30 rounded-lg">
                                    <p className="text-muted-foreground">No milestones added yet. Click "Add Milestone" to create one.</p>
                                </div>
                            ) : (
                                milestoneFields.map((field, index) => (
                                    <div key={index} className="border rounded-lg p-4 relative">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 h-8 w-8 p-0"
                                            onClick={() => removeMilestone(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        
                                        <div className="grid gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`milestones.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Milestone Name *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g., Site Preparation Complete" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            
                                            <FormField
                                                control={form.control}
                                                name={`milestones.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea 
                                                                placeholder="Describe what this milestone involves..."
                                                                className="min-h-[60px]"
                                                                {...field} 
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`milestones.${index}.dueDate`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Due Date *</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "pl-3 text-left font-normal w-full",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                formatDate(field.value.toString())
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
                                                                        className={cn("p-3 pointer-events-auto")}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                
                                                <FormField
                                                    control={form.control}
                                                    name={`milestones.${index}.progress`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Progress (%)</FormLabel>
                                                            <FormControl>
                                                                <Input 
                                                                    type="number" 
                                                                    min="0" 
                                                                    max="100"
                                                                    placeholder="0"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <FormDescription className="text-center mt-4">
                            Milestones help track key project deliverables and progress points.
                        </FormDescription>
                    </div>
                );
                
            case 4: // Risks step
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Project Risks</h3>
                            <Button 
                                type="button" 
                                onClick={addRisk}
                                size="sm"
                            >
                                Add Risk
                            </Button>
                        </div>
                        
                        <div className="space-y-6">
                            {riskFields.length === 0 ? (
                                <div className="text-center py-8 bg-muted/30 rounded-lg">
                                    <p className="text-muted-foreground">No risks identified yet. Click "Add Risk" to create one.</p>
                                </div>
                            ) : (
                                riskFields.map((field, index) => (
                                    <div key={index} className="border rounded-lg p-4 relative">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 h-8 w-8 p-0"
                                            onClick={() => removeRisk(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        
                                        <div className="grid gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`risks.${index}.title`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Risk Title *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g., Weather Delays" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            
                                            <FormField
                                                control={form.control}
                                                name={`risks.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea 
                                                                placeholder="Describe the risk and its potential impact..."
                                                                className="min-h-[60px]"
                                                                {...field} 
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`risks.${index}.severity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Severity *</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select severity" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Low">Low</SelectItem>
                                                                    <SelectItem value="Medium">Medium</SelectItem>
                                                                    <SelectItem value="High">High</SelectItem>
                                                                    <SelectItem value="Critical">Critical</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                
                                                <FormField
                                                    control={form.control}
                                                    name={`risks.${index}.status`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Status</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Open">Open</SelectItem>
                                                                    <SelectItem value="Mitigating">Mitigating</SelectItem>
                                                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                                                    <SelectItem value="Accepted">Accepted</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            
                                            <FormField
                                                control={form.control}
                                                name={`risks.${index}.mitigationPlan`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Mitigation Plan</FormLabel>
                                                        <FormControl>
                                                            <Textarea 
                                                                placeholder="Describe how this risk will be mitigated..."
                                                                className="min-h-[60px]"
                                                                {...field} 
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <FormDescription className="text-center mt-4">
                            Identifying risks early helps in planning mitigation strategies and ensuring project success.
                        </FormDescription>
                    </div>
                );

                case 5: // Review step
                const formData = form.getValues();
                const selectedLeader = users?.find(u => u?._id === formData.projectLeader);
                const selectedSubcontractors = subcontractors?.filter(s =>
                    Array.isArray(formData.subcontractors) && formData.subcontractors?.includes(s?._id || "")
                );
                const selectedServiceOrder = serviceOrders?.find(so => so?._id === formData.serviceOrder);
                const selectedLocation = locations?.find(loc => loc?._id === formData.location);
              
                return (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">Review Project Details</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Please review all information carefully before creating your project. You can go back to make changes if needed.
                      </p>
                    </div>
              
                    {/* Review Cards */}
                    <div className="grid gap-6">
                      {/* Basic Information Card */}
                      <div className="border rounded-xl p-6 bg-card">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                          <h4 className="text-lg font-semibold">Basic Information</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Project Name</label>
                              <p className="font-medium">{formData.name || 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Project Type</label>
                              <p className="font-medium">{formData.projectType || 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Capacity</label>
                              <p className="font-medium">{formData.capacity || 'Not specified'}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Contract Value</label>
                              <p className="font-medium text-lg text-green-600">
                                KES {formData.contractValue?.toLocaleString() || '0'}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Priority</label>
                              <Badge 
                                variant={formData.priority === 'High' ? 'destructive' : formData.priority === 'Medium' ? 'default' : 'secondary'}
                                className="w-fit"
                              >
                                {formData.priority}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Status</label>
                              <Badge variant="outline" className="w-fit">
                                {formData.status || 'Draft'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {formData.description && (
                          <div className="mt-4 pt-4 border-t">
                            <label className="text-sm font-medium text-muted-foreground">Description</label>
                            <p className="mt-1 text-sm leading-relaxed">{formData.description}</p>
                          </div>
                        )}
                      </div>
              
                      {/* Service Order & Location Card */}
                      <div className="border rounded-xl p-6 bg-card">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-amber-600" />
                          </div>
                          <h4 className="text-lg font-semibold">Service Order & Location</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Service Order</label>
                            {selectedServiceOrder ? (
                              <div className="mt-2 p-3 bg-muted/50 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Issued By:</span>
                                  <span className="font-medium">{selectedServiceOrder.issuedBy}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Issued To:</span>
                                  <span className="font-medium">{selectedServiceOrder.issuedTo}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Date:</span>
                                  <span className="font-medium">{selectedServiceOrder.serviceOrderDate ? format(new Date(selectedServiceOrder.serviceOrderDate), "PPP") : 'Not available'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Status:</span>
                                  <Badge variant="outline">{selectedServiceOrder.status}</Badge>
                                </div>
                              </div>
                            ) : (
                              <p className="text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">No service order selected</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Project Location</label>
                            {selectedLocation ? (
                              <div className="mt-2 p-3 bg-muted/50 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Name:</span>
                                  <span className="font-medium">{selectedLocation.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Site ID:</span>
                                  <span className="font-medium">{selectedLocation.siteId}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">System Site ID:</span>
                                  <span className="font-medium">{selectedLocation.systemSiteId}</span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">No location selected</p>
                            )}
                          </div>
                        </div>
                      </div>
              
                      {/* Team & Resources Card */}
                      <div className="border rounded-xl p-6 bg-card">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 className="text-lg font-semibold">Team & Resources</h4>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Project Leader</label>
                            {selectedLeader ? (
                              <div className="flex items-center gap-3 mt-2 p-3 bg-muted/50 rounded-lg">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary-foreground">
                                    {selectedLeader.firstName?.charAt(0)}{selectedLeader.lastName?.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium">{selectedLeader.firstName} {selectedLeader.lastName}</p>
                                  <p className="text-sm text-muted-foreground">{selectedLeader.email}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">No project leader selected</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Subcontractors ({selectedSubcontractors?.length || 0})
                            </label>
                            {selectedSubcontractors?.length > 0 ? (
                              <div className="mt-2 space-y-2">
                                {selectedSubcontractors.map((sub) => (
                                  <div key={sub._id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                                      <span className="text-sm font-medium">
                                        {sub.companyName ? sub.companyName.charAt(0) : sub.firstName?.charAt(0)}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {sub.companyName || `${sub.firstName} ${sub.lastName}`}
                                      </p>
                                      <p className="text-sm text-muted-foreground">{sub.email}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">No subcontractors selected</p>
                            )}
                          </div>
                        </div>
                      </div>
              
                      {/* Schedule Card */}
                      <div className="border rounded-xl p-6 bg-card">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-green-600" />
                          </div>
                          <h4 className="text-lg font-semibold">Project Schedule</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Planned Start Date</label>
                            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {formData.plannedStartDate ? format(formData.plannedStartDate, "EEEE, MMMM d, yyyy") : 'Not set'}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Target Completion Date</label>
                            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {formData.targetCompletionDate ? format(formData.targetCompletionDate, "EEEE, MMMM d, yyyy") : 'Not set'}
                              </span>
                            </div>
                          </div>
                        </div>
                        {formData.plannedStartDate && formData.targetCompletionDate && (
                          <div className="mt-4 pt-4 border-t">
                            <label className="text-sm font-medium text-muted-foreground">Project Duration</label>
                            <p className="font-medium">
                              {Math.ceil((formData.targetCompletionDate.getTime() - formData.plannedStartDate.getTime()) / (1000 * 60 * 60 * 24))} days
                            </p>
                          </div>
                        )}
                      </div>
              
                      {/* Milestones Card */}
                      {formData.milestones && formData.milestones.length > 0 && (
                        <div className="border rounded-xl p-6 bg-card">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <FlagIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h4 className="text-lg font-semibold">Project Milestones ({formData.milestones.length})</h4>
                          </div>
                          <div className="space-y-4">
                            {formData.milestones.map((milestone, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium">{milestone.name}</h5>
                                  <Badge variant={milestone.progress === 100 ? "success" : "outline"}>
                                    {milestone.progress}% Complete
                                  </Badge>
                                </div>
                                {milestone.description && (
                                  <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Due Date:</span>{' '}
                                    <span className="font-medium">{milestone.dueDate ? format(new Date(milestone.dueDate), "MMM d, yyyy") : 'Not set'}</span>
                                  </div>
                                  {milestone.completedDate && (
                                    <div>
                                      <span className="text-muted-foreground">Completed:</span>{' '}
                                      <span className="font-medium">{format(new Date(milestone.completedDate), "MMM d, yyyy")}</span>
                                    </div>
                                  )}
                                </div>
                                {milestone.deliverables && milestone.deliverables.length > 0 && (
                                  <div className="mt-3">
                                    <span className="text-sm text-muted-foreground">Deliverables:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {milestone.deliverables.map((deliverable, idx) => (
                                        <Badge key={idx} variant="secondary">{deliverable}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
              
                      {/* Risks Card */}
                      {formData.risks && formData.risks.length > 0 && (
                        <div className="border rounded-xl p-6 bg-card">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <h4 className="text-lg font-semibold">Project Risks ({formData.risks.length})</h4>
                          </div>
                          <div className="space-y-4">
                            {formData.risks.map((risk, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium">{risk.title}</h5>
                                  <Badge 
                                    variant={
                                      risk.severity === 'Critical' ? "destructive" : 
                                      risk.severity === 'High' ? "destructive" : 
                                      risk.severity === 'Medium' ? "default" : 
                                      "secondary"
                                    }
                                  >
                                    {risk.severity} Severity
                                  </Badge>
                                </div>
                                {risk.description && (
                                  <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Status:</span>{' '}
                                    <Badge variant="outline">{risk.status}</Badge>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Identified:</span>{' '}
                                    <span className="font-medium">{risk.identifiedDate ? format(new Date(risk.identifiedDate), "MMM d, yyyy") : 'Not set'}</span>
                                  </div>
                                  {risk.targetResolutionDate && (
                                    <div>
                                      <span className="text-muted-foreground">Target Resolution:</span>{' '}
                                      <span className="font-medium">{format(new Date(risk.targetResolutionDate), "MMM d, yyyy")}</span>
                                    </div>
                                  )}
                                  {risk.impact !== undefined && (
                                    <div>
                                      <span className="text-muted-foreground">Impact:</span>{' '}
                                      <span className="font-medium">{risk.impact}/10</span>
                                    </div>
                                  )}
                                </div>
                                {risk.mitigationPlan && (
                                  <div className="mt-3 pt-3 border-t">
                                    <span className="text-sm font-medium text-muted-foreground">Mitigation Plan:</span>
                                    <p className="text-sm mt-1">{risk.mitigationPlan}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
              
                      {/* Additional Notes Card (if notes exist) */}
                      {formData.notes && (
                        <div className="border rounded-xl p-6 bg-card">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-orange-600" />
                            </div>
                            <h4 className="text-lg font-semibold">Additional Notes</h4>
                          </div>
                          <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg">
                            {formData.notes}
                          </p>
                        </div>
                      )}
                    </div>
              
                    {/* Summary Bar */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <span className="font-medium">Ready to create project</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          All required information has been provided
                        </span>
                      </div>
                    </div>
                  </div>
                );

            default:
                return null;
        }
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[95vh]">
                <DrawerHeader className="text-center sm:text-center">
                    <DrawerTitle>Create New Project</DrawerTitle>
                    <DrawerDescription>
                        Follow these steps to create a new project in the system
                    </DrawerDescription>
                </DrawerHeader>

                <div className="px-4  overflow-y-auto">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2",
                                        index <= currentStep
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : "border-muted-foreground text-muted-foreground"
                                    )}>
                                        {index < currentStep ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : (
                                            <step.icon className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <div className="font-medium text-sm">{step.title}</div>
                                        <div className="text-xs text-muted-foreground hidden sm:block">{step.description}</div>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <Separator className={cn(
                                        "w-12 mx-4 mt-5",
                                        index < currentStep ? "bg-primary" : "bg-muted"
                                    )} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Form Content */}
                    <Form {...form}>
                        <div className="space-y-6">
                            <div className="max-w-2xl mx-auto">
                                {renderStepContent()}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between p-2 border-t bg-card sticky bottom-0 left-0 z-10">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                >
                                    Previous
                                </Button>

                                <div className="flex space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                    >
                                        Cancel
                                    </Button>

                                    {currentStep < steps.length - 1 ? (
                                        <Button type="button" onClick={nextStep}>
                                            Next
                                        </Button>
                                    ) : (
                                        <Button 
                                            type="button" 
                                            disabled={isSubmitting}
                                            onClick={() => {
                                                form.handleSubmit(onSubmit)();
                                            }}
                                        >
                                            {isSubmitting ? <div className="flex items-center gap-2"><Spinner/> <span>Creating...</span></div> : 'Create Project'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}