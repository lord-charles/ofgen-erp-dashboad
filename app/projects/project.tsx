"use client"

import { Project } from "@/services/project.service";
import { PaginatedResponse } from "@/services/employees.service";
import ProjectStatCards from "./components/project-statcards";
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ProjectTable from "./components/projects-table/projects"

interface ProjectProps {
  projects: PaginatedResponse<Project>;
}

export default function ProjectModule({ projects }: ProjectProps) {
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
            <Button
              size="sm"
              onClick={() => {
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
          <div className="p-3">
            <ProjectTable projects={projects} />
          </div>
        </Card>
      </div>
    </div>
  );
}
