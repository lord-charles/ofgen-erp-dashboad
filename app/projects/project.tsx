"use client"

import { useState } from "react";
import { Project } from "@/services/project.service";
import { PaginatedResponse } from "@/services/employees.service";
import ProjectStatCards from "./components/project-statcards";
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"
import ProjectTable from "./components/projects-table/projects"
import { CreateProjectDrawer } from "./components/add-project";

interface ProjectProps {
  projects: PaginatedResponse<Project>;
}

export default function ProjectModule({ projects }: ProjectProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <div>
     <ProjectStatCards projectData={projects} />
     <div className="grid gap-4 pt-2">
        <Card>
          <div className="p-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Project List</CardTitle>
              <CardDescription>View and manage your projects</CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 text-white"
            onClick={() => setIsDrawerOpen(true)}>
                <Plus className="mr-2 h-4 w-4 text-white" />
                Add Project
                <Sparkles className="ml-2 h-4 w-4 text-white" />
              </Button>
          </div>
          <div className="p-3">
            <ProjectTable projects={projects} />
          </div>
        </Card>
      </div>

      <CreateProjectDrawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
      />
    </div>
  );
}
