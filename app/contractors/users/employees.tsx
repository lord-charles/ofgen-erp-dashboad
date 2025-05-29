"use client";

import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Building2,
  UserPlus,
} from "lucide-react";
import { User } from "@/types/user";
import EmployeeTable from "./users-table/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubContractorTable from "./subcontractor-table/sub-contractor";
import { Subcontractor } from "@/services/subcontractors.service";
import AddSubcontractorDialog from "./subcontractor-table/add-subcontractor";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddContractorDialog from "./users-table/add-contractor";
import ConsultantStats from "./statcards/consultant-stats";
import SubcontractorStats from "./statcards/subcontrator-stats";

interface EmployeeModuleProps {
  initialData: User[];
  subcontractors: Subcontractor[];
}

export default function EmployeeModule({ initialData, subcontractors: initialSubcontractors }: EmployeeModuleProps) {
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>(initialSubcontractors || []);
  
  const handleAdd = (newSubcontractor: Subcontractor) => {
    console.log('New subcontractor added:', newSubcontractor);
    
    if (newSubcontractor) {
      const normalizedSubcontractor = {
        _id: newSubcontractor._id || `temp-${Date.now()}`, 
        isCompany: newSubcontractor.isCompany || false,
        email: newSubcontractor.email || "",
        phone: newSubcontractor.phone || "",
        address: newSubcontractor.address || "",
        companyName: newSubcontractor.companyName || "",
        registrationNumber: newSubcontractor.registrationNumber || "",
        taxPin: newSubcontractor.taxPin || "",
        contactPerson: newSubcontractor.contactPerson || "",
        firstName: newSubcontractor.firstName || "",
        lastName: newSubcontractor.lastName || "",
        nationalId: newSubcontractor.nationalId || "",
        specialty: newSubcontractor.specialty || "",
        skills: Array.isArray(newSubcontractor.skills) ? newSubcontractor.skills : [],
        isActive: typeof newSubcontractor.isActive === 'boolean' ? newSubcontractor.isActive : true,
        notes: newSubcontractor.notes || "",
        createdAt: newSubcontractor.createdAt || new Date().toISOString(),
        updatedAt: newSubcontractor.updatedAt || new Date().toISOString(),
        rating: newSubcontractor.rating || 0
      };
      
      setSubcontractors([...subcontractors, normalizedSubcontractor]);
    }
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "contrators");


  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", value);
    router.replace(`?${params.toString()}`);
  };
  const handleContractorAdd = (newContractor: any) => {
    console.log('New contractor added:', newContractor);
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="grid gap-2">
        <Card>
          <div className="p-2 flex flex-row items-center justify-between ">
            <div>
              <CardTitle>
                Contrators List
              </CardTitle>
              <CardDescription>
                  View and manage your Contrators
              </CardDescription>
            </div>
            
              <div className="flex gap-2">
                <AddContractorDialog
              onAdd={handleContractorAdd}
              trigger={
                <Button size="sm">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add New Contractor
                </Button>
              }
            />
             
                <AddSubcontractorDialog
            onAdd={(subcontractor) => {
              handleAdd(subcontractor as Subcontractor);
            }}
            trigger={
              <Button size="sm" variant="outline" >
                  <Plus className="h-4 w-4 mr-2" />
                Add New Subcontractor
              </Button>
            }
          />
              </div>
            
          </div>
          <div className="p-2">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList>
                <TabsTrigger value="contrators" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Contrators
                </TabsTrigger>
                <TabsTrigger value="sub-contrators" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Sub-Contrators
                </TabsTrigger>
              </TabsList>
              <TabsContent value="contrators" className="mt-4 space-y-6 max-w-[calc(100vw-300px)]">
                <ConsultantStats consultants={initialData} />
                <EmployeeTable
                  employees={initialData}
                />
              </TabsContent>
              <TabsContent value="sub-contrators" className="mt-4 space-y-6 max-w-[calc(100vw-300px)]">
              <SubcontractorStats subcontractorData={subcontractors} />
                <SubContractorTable employees={subcontractors} />
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
}
