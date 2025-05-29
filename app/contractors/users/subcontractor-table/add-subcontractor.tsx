
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Building2, User, Star, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createSubcontractor, CreateSubcontractorDto } from "@/services/subcontractors.service";

enum SubcontractorSpecialty {
  CIVIL = 'Civil Works',
  ELECTRICAL = 'Electrical Installation',
  NETWORK = 'Network Configuration',
  MECHANICAL = 'Mechanical Installation',
  SECURITY = 'Security Systems',
  GENERAL = 'General Construction',
  TRANSPORT = 'Transportation & Logistics'
}

// Default template for subcontractor data to ensure consistent structure
const defaultSubcontractorTemplate: CreateSubcontractorDto = {
  isCompany: false,
  email: "",
  phone: "",
  address: "",
  specialty: "",
  skills: [],
  isActive: true,
  // Optional fields can be initialized as empty strings
  companyName: "",
  registrationNumber: "",
  taxPin: "",
  contactPerson: "",
  firstName: "",
  lastName: "",
  nationalId: "",
  notes: ""
};

const subcontractorSchema = z.object({
  isCompany: z.boolean().default(false),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),
  taxPin: z.string().optional(),
  contactPerson: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  nationalId: z.string().optional(),
  specialty: z.string().optional(), // Changed from enum to string to match API expectations
  skills: z.array(z.string()).default([]),
  rating: z.number().min(1).max(5).optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.isCompany) {
    return data.companyName && data.companyName.length > 0;
  } else {
    return data.firstName && data.firstName.length > 0 && data.lastName && data.lastName.length > 0;
  }
}, {
  message: "Company name is required for companies, first and last name are required for individuals",
  path: ["companyName"]
});

type SubcontractorFormData = z.infer<typeof subcontractorSchema>;

interface AddSubcontractorDialogProps {
  trigger: React.ReactNode;
  onAdd?: (subcontractor: any) => void;
}

const AddSubcontractorDialog: React.FC<AddSubcontractorDialogProps> = ({
  trigger,
  onAdd
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<SubcontractorFormData>({
    resolver: zodResolver(subcontractorSchema),
    defaultValues: {
      isCompany: false,
      email: "",
      phone: "",
      address: "",
      companyName: "",
      registrationNumber: "",
      taxPin: "",
      contactPerson: "",
      firstName: "",
      lastName: "",
      nationalId: "",
      skills: [],
      rating: undefined,
      isActive: true,
      notes: "",
    },
  });

  const isCompany = form.watch("isCompany");
  const skills = form.watch("skills");

  const handleSubmit = async (data: SubcontractorFormData) => {
    setIsLoading(true);
    try {
      // Clean up empty string values and ensure data structure matches API expectations
      const cleanData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === "" ? undefined : value
        ])
      ) as SubcontractorFormData;

      // Extract rating separately since it's not part of CreateSubcontractorDto
      const { rating, ...formDataWithoutRating } = cleanData;
      
      // Create a normalized data object that conforms to the API's expected structure
      const apiData: CreateSubcontractorDto = {
        ...defaultSubcontractorTemplate,
        ...formDataWithoutRating,
        // Ensure specialty is a string (not undefined)
        specialty: formDataWithoutRating.specialty || "",
        // Ensure skills is an array
        skills: Array.isArray(formDataWithoutRating.skills) ? formDataWithoutRating.skills : [],
      };

      console.log('Submitting subcontractor to API:', apiData);
      
      // Call the API to create the subcontractor
      const result = await createSubcontractor(apiData);
      
      // Pass the result to the parent component's handler
      if (result) {
        onAdd?.(result);
      } else {
        // If no result from API, create a temporary object that matches Subcontractor interface
        const tempSubcontractor = {
          _id: `temp-${Date.now()}`,
          ...apiData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Use the rating from the form data
          rating: rating || form.getValues("rating") || 0
        };
        onAdd?.(tempSubcontractor);
      }
      
      setOpen(false);
      form.reset();
      setActiveTab("basic");
      
      toast({
        title: "Success",
        description: `${isCompany ? 'Company' : 'Individual'} subcontractor added successfully!`,
      });
    } catch (error: any) {
      console.error('Error adding subcontractor:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to add subcontractor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      form.setValue("skills", [...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    form.setValue("skills", skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const canProceedToNext = (tab: string) => {
    if (tab === "basic") {
      const email = form.getValues("email");
      const phone = form.getValues("phone");
      return email || phone; 
    }
    if (tab === "identity") {
      if (isCompany) {
        return form.getValues("companyName");
      } else {
        return form.getValues("firstName") && form.getValues("lastName");
      }
    }
    if (tab === "professional") {
      const specialty = form.getValues("specialty");
      return !!specialty && specialty.trim().length > 0;
    }
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Subcontractor
          </DialogTitle>
          <DialogDescription>
            Fill out the information to add a new subcontractor to your network.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger 
                  value="identity" 
                  className="flex items-center gap-2"
                  disabled={!canProceedToNext("basic")}
                >
                  <Building2 className="h-4 w-4" />
                  Identity
                </TabsTrigger>
                <TabsTrigger 
                  value="professional" 
                  className="flex items-center gap-2"
                  disabled={!canProceedToNext("identity")}
                >
                  <Star className="h-4 w-4" />
                  Professional
                </TabsTrigger>
                <TabsTrigger 
                  value="additional" 
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Additional
                </TabsTrigger>
              </TabsList>

              <div className="min-h-[400px] max-h-[400px] overflow-y-auto">
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="isCompany"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Subcontractor Type
                              </FormLabel>
                              <div className="text-sm text-muted-foreground">
                                {field.value ? "Company/Organization" : "Individual"}
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="email@example.com" 
                                  type="email"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="+254712345678" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Physical Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Street, City, Country" 
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

                <TabsContent value="identity" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {isCompany ? "Company Details" : "Personal Details"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isCompany ? (
                        <>
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Nairobi Electrical Solutions Ltd" 
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
                              name="registrationNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Registration Number</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="KE-C-123456" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="taxPin"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>KRA PIN</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="A123456789B" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="contactPerson"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Contact Person</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="John Kamau" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name *</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="John" 
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
                                    <Input 
                                      placeholder="Kamau" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="nationalId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>National ID Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="12345678" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="professional" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Professional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="specialty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specialty</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(value)} 
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select specialty" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(SubcontractorSpecialty).map(([key, value]) => (
                                    <SelectItem key={key} value={value}>
                                      {value}
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
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Initial Rating (1-5)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  max="5" 
                                  step="0.1"
                                  placeholder="4.5" 
                                  value={field.value || ""} 
                                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Skills & Certifications</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder="Enter a skill"
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyPress={handleKeyPress}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={addSkill}
                            disabled={!currentSkill.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="additional" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Active Status
                              </FormLabel>
                              <div className="text-sm text-muted-foreground">
                                {field.value ? "Active and available for projects" : "Inactive"}
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Additional notes about the subcontractor..."
                                className="min-h-[100px]"
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
              </div>
              <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                {activeTab !== "basic" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const tabs = ["basic", "identity", "professional", "additional"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1]);
                      }
                    }}
                    disabled={isLoading}
                  >
                    Previous
                  </Button>
                )}
                {activeTab !== "additional" ? (
                  <Button
                    type="button"
                    onClick={() => {
                      const tabs = ["basic", "identity", "professional", "additional"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1 && canProceedToNext(activeTab)) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                    disabled={!canProceedToNext(activeTab) || isLoading}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={form.handleSubmit(handleSubmit)}
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? "Adding..." : "Add Subcontractor"}
                  </Button>
                )}
              </div>
            </div>
            </Tabs>

        
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubcontractorDialog;
