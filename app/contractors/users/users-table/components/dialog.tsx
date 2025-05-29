import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X, User, Briefcase, Calendar, Phone, Mail, Hash } from "lucide-react";
import { User as UserType } from "@/types/user";
import { updateEmployee } from "@/services/employees.service";

interface ContractorDialogProps {
  contractor: UserType;
  trigger: React.ReactNode;
}

const ContractorDialog = ({ contractor, trigger }: ContractorDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedContractor, setEditedContractor] = useState<UserType>(contractor);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContractor(contractor);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContractor(contractor);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const {
        _id,
        createdAt,
        updatedAt,
        ...updateDto
      } = editedContractor as any;
      await updateEmployee(contractor._id, updateDto);
      setIsEditing(false);
      setIsOpen(false);
      toast({
        title: "Contractor Updated",
        description: "Contractor information has been successfully updated.",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error updating contractor",
        description: error?.message || "An error occurred while updating the contractor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserType, value: any) => {
    setEditedContractor(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString?: string | null ) => {
    if (!dateString || isNaN(Date.parse(dateString))) {
      return "";
    }

    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isEditing ? "Edit Contractor" : "Contractor Details"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Update contractor information" : "View contractor information and performance details"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={editedContractor.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm bg-muted p-2 rounded">{contractor.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={editedContractor.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm bg-muted p-2 rounded">{contractor.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationalId" className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    National ID
                  </Label>
                  {isEditing ? (
                    <Input
                      id="nationalId"
                      value={editedContractor.nationalId}
                      onChange={(e) => handleInputChange('nationalId', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm bg-muted p-2 rounded">{contractor.nationalId}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Date of Birth
                  </Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editedContractor?.dateOfBirth?.split('T')[0]}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value + 'T00:00:00.000Z')}
                    />
                  ) : (
                    <p className="text-sm bg-muted p-2 rounded">{formatDate(contractor?.dateOfBirth || '')}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedContractor.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled
                    />
                  ) : (
                    <p className="text-sm bg-muted p-2 rounded">{contractor.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phoneNumber"
                      value={editedContractor.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm bg-muted p-2 rounded">{contractor.phoneNumber}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  {isEditing ? (
                    <Input
                      id="employeeId"
                      value={editedContractor.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      disabled
                    />
                  ) : (
                    <p className="text-sm bg-muted p-2 rounded">{contractor.employeeId}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  {isEditing ? (
                    <Input
                      id="position"
                      value={editedContractor.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm bg-muted p-2 rounded">{contractor.position}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  {isEditing ? (
                    <select
                      id="employmentType"
                      value={editedContractor.employmentType}
                      onChange={(e) => handleInputChange('employmentType', e.target.value)}
                      className="w-full p-2 border border-input rounded-md bg-background"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                    </select>
                  ) : (
                    <p className="text-sm bg-muted p-2 rounded capitalize">{contractor.employmentType}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentEndDate">Employment End Date</Label>
                  {isEditing ? (
                    <Input
                      id="employmentEndDate"
                      type="date"
                      value={editedContractor?.employmentEndDate?.split('T')[0] || ''}
                      onChange={(e) => handleInputChange('employmentEndDate', e.target.value + 'T00:00:00.000Z')}
                    />
                  ) : (
                    <p className="text-sm bg-muted p-2 rounded">{formatDate(contractor?.employmentEndDate || '')}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="status">Active Status</Label>
                {isEditing ? (
                  <Switch
                    id="status"
                    checked={editedContractor?.status === 'active'}
                    onCheckedChange={(checked) => handleInputChange('status', checked ? 'active' : 'inactive')}
                  />
                ) : (
                  <Badge variant={contractor?.status === 'active' ? 'default' : 'destructive'}>
                    {contractor?.status}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label>Roles</Label>
                <div className="flex flex-wrap gap-2">
                  {contractor?.roles?.map((role, index) => (
                    <Badge key={index} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          {isEditing ? (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={handleEdit} className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit Contractor
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractorDialog;
