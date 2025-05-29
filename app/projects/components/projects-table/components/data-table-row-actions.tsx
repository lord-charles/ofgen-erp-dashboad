"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteProject } from "@/services/project.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { ProjectDrawer } from "../view-edit-project";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const project = row.original as any;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (loadingDelete) return;
    try {
      setLoadingDelete(true);
      await deleteProject(project._id);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoadingDelete(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
 <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsProjectDrawerOpen(true)}>
            <Pencil className="h-5 w-5" />
            View | Edit Form
          </DropdownMenuItem>
         
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600 focus:text-red-700" onSelect={e => e.preventDefault()}>
                <Trash2 className="h-5 w-5" />
                Delete
                <DropdownMenuShortcut>Del</DropdownMenuShortcut>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <b>{project.name}</b>? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loadingDelete}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={loadingDelete} className="bg-red-600 hover:bg-red-700 text-white">
                  {loadingDelete ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProjectDrawer 
        open={isProjectDrawerOpen} 
        onOpenChange={setIsProjectDrawerOpen}
        project={project}
      />

    </>
  );
}
