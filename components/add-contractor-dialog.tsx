import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { User, Briefcase, Phone, Mail } from "lucide-react";
import { registerEmployee } from "@/services/employees.service";

const contractorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  nationalId: z.string().min(1, "National ID is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  position: z.string().min(1, "Position is required"),
  employmentType: z.enum(["full-time", "part-time", "contract"]),
  employmentEndDate: z.string().min(1, "Employment end date is required"),
  status: z.enum(["active", "inactive"]),
  roles: z.array(z.string()).min(1, "At least one role is required"),
});

type ContractorFormData = z.infer<typeof contractorSchema>;

interface AddContractorDialogProps {
  onAdd: (contractor: ContractorFormData) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const AddContractorDialog = ({ onAdd, open, setOpen }: AddContractorDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const handleSetOpen = setOpen || setInternalOpen;
  const [isLoading, setIsLoading] = useState(false);
  const [newRole, setNewRole] = useState("");
  const { toast } = useToast();

  const form = useForm<ContractorFormData>({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      nationalId: "",
      dateOfBirth: "",
      position: "",
      employmentType: "full-time",
      employmentEndDate: "",
      status: "active",
      roles: ["employee"],
    },
  });

  const onSubmit = async (data: ContractorFormData) => {
    setIsLoading(true);
    try {
      const { ...dto } = data as any;
      await registerEmployee(dto);
      onAdd(data);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Contractor Added",
        description:
          "New contractor has been successfully added to the system.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding contractor",
        description:
          error?.message || "An error occurred while adding the contractor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addRole = () => {
    if (newRole.trim()) {
      const currentRoles = form.getValues("roles");
      if (!currentRoles.includes(newRole.trim())) {
        form.setValue("roles", [...currentRoles, newRole.trim()]);
      }
      setNewRole("");
    }
  };

  const removeRole = (roleToRemove: string) => {
    const currentRoles = form.getValues("roles");
    form.setValue(
      "roles",
      currentRoles.filter((role) => role !== roleToRemove)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleSetOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Contractor
          </DialogTitle>
          <DialogDescription>
            Enter contractor information to add them to the system
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {/* Red dot indicator logic for each tab */}
                {(() => {
                  const personalFields: Array<keyof ContractorFormData> = [
                    "firstName",
                    "lastName",
                    "nationalId",
                    "dateOfBirth",
                  ];
                  const contactFields: Array<keyof ContractorFormData> = [
                    "email",
                    "phoneNumber",
                  ];
                  const employmentFields: Array<keyof ContractorFormData> = [
                    "position",
                    "employmentType",
                    "employmentEndDate",
                    "status",
                    "roles",
                  ];
                  const errors = form.formState.errors;
                  const hasPersonalError = personalFields.some(
                    (f) => !!errors[f]
                  );
                  const hasContactError = contactFields.some(
                    (f) => !!errors[f]
                  );
                  const hasEmploymentError = employmentFields.some(
                    (f) => !!errors[f]
                  );
                  const RedDot = () => (
                    <span className="ml-1 inline-block w-2 h-2 rounded-full bg-red-500 align-middle" />
                  );
                  return (
                    <>
                      <TabsTrigger
                        value="personal"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Personal
                        {hasPersonalError && <RedDot />}
                      </TabsTrigger>
                      <TabsTrigger
                        value="contact"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Contact
                        {hasContactError && <RedDot />}
                      </TabsTrigger>
                      <TabsTrigger
                        value="employment"
                        className="flex items-center gap-2"
                      >
                        <Briefcase className="h-4 w-4" />
                        Employment
                        {hasEmploymentError && <RedDot />}
                      </TabsTrigger>
                    </>
                  );
                })()}
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter first name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nationalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter national ID"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Password *
                          </FormLabel>
                          <FormControl>
                            <Input
                              //   type="password"
                              placeholder="Enter password (min 6 chars)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            Phone Number *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 254712345678"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="employment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Employment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 ">
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Software Engineer"
                                {...field}
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
                          <FormItem className="flex items-center space-x-2">
                            <FormLabel>Active Status</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value === "active"}
                                onCheckedChange={(checked) =>
                                  field.onChange(
                                    checked ? "active" : "inactive"
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="employmentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employment Type *</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full p-2 border border-input rounded-md bg-background"
                              >
                                <option value="full-time">Full Time</option>
                                <option value="part-time">Part Time</option>
                                <option value="contract">Contract</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employmentEndDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employment End Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/*                  

                    <div className="space-y-2">
                      <Label>Roles *</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a role"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                        />
                        <Button type="button" onClick={addRole} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.watch("roles").map((role, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {role}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeRole(role)}
                            />
                          </Badge>
                        ))}
                      </div>
                      {form.formState.errors.roles && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.roles.message}
                        </p>
                      )}
                    </div> */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSetOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding Contractor..." : "Add Contractor"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContractorDialog;
