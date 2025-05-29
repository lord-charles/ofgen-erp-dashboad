import { z } from 'zod';

// Enum definitions to match the Mongoose schema
export const ProjectStatus = z.enum(['Draft', 'Planned', 'In Progress', 'On Hold', 'Completed', 'Cancelled']);
export const TaskStatus = z.enum(['Pending', 'In Progress', 'Completed', 'Blocked', 'Cancelled']);
export const TaskPriority = z.enum(['Low', 'Medium', 'High', 'Critical']);
export const RiskSeverity = z.enum(['Low', 'Medium', 'High', 'Critical']);

// Task schema
const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  assignedSubcontractor: z.string().optional(),
  status: TaskStatus.default('Pending'),
  priority: TaskPriority.default('Medium'),
  plannedStartDate: z.date().optional(),
  plannedEndDate: z.date().optional(),
  actualStartDate: z.date().optional(),
  actualEndDate: z.date().optional(),
  progress: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
});

// Milestone schema
const milestoneSchema = z.object({
  name: z.string().min(1, 'Milestone name is required'),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  completedDate: z.date().optional(),
  progress: z.number().min(0).max(100).default(0),
  tasks: z.array(taskSchema).default([]),
  deliverables: z.array(z.string()).default([]),
});

// Risk schema
const riskSchema = z.object({
  title: z.string().min(1, 'Risk title is required'),
  description: z.string().optional(),
  severity: RiskSeverity,
  probability: z.number().min(0).max(1).optional(),
  impact: z.number().min(1).max(10).optional(),
  mitigationPlan: z.string().optional(),
  owner: z.string().optional(),
  status: z.string().default('Open'),
  identifiedDate: z.date().default(() => new Date()),
  targetResolutionDate: z.date().optional(),
  notes: z.string().optional(),
});

// Main project schema based on the Mongoose schema
export const projectSchema = z.object({
  // Required fields
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  projectType: z.string().min(1, 'Project type is required'),
  capacity: z.string().min(1, 'Capacity is required'),
  contractValue: z.number().min(1, 'Contract value must be greater than 0'),
  priority: TaskPriority,
  
  // Optional fields
  serviceOrder: z.string().optional(),
  location: z.string().optional(),
  projectLeader: z.string().optional(),
  subcontractors: z.array(z.string()).default([]),
  status: ProjectStatus.default('Draft'),
  plannedStartDate: z.date({
    required_error: 'Planned start date is required',
  }),
  targetCompletionDate: z.date({
    required_error: 'Target completion date is required',
  }),
  actualStartDate: z.date().optional(),
  actualCompletionDate: z.date().optional(),
  progress: z.number().min(0).max(100).default(0),
  milestones: z.array(milestoneSchema).default([]),
  risks: z.array(riskSchema).default([]),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
}).refine((data) => {
  if (data.targetCompletionDate && data.plannedStartDate) {
    return data.targetCompletionDate > data.plannedStartDate;
  }
  return true;
}, {
  message: "Target completion date must be after planned start date",
  path: ["targetCompletionDate"],
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type MilestoneFormData = z.infer<typeof milestoneSchema>;
export type RiskFormData = z.infer<typeof riskSchema>;
