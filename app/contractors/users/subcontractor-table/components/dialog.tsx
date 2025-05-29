
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Separator } from "@/components/ui/separator";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Switch } from "@/components/ui/switch";
  import { Textarea } from "@/components/ui/textarea";
  import { useToast } from "@/hooks/use-toast";
  import { 
    Building2, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    FileText, 
    Star,
    Calendar,
    Briefcase,
    Edit,
    Save,
    X
  } from "lucide-react";
  import { useState } from "react";
import { Subcontractor, updateSubcontractor } from "@/services/subcontractors.service";
  
  interface SubcontractorDialogProps {
    subcontractor: Subcontractor;
    trigger?: React.ReactNode;
    onUpdate?: (updatedSubcontractor: Subcontractor) => void;
  }
  
  const SubcontractorDialog = ({ 
    subcontractor, 
    trigger = <Button variant="outline">View Details</Button>,
    onUpdate
  }: SubcontractorDialogProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Subcontractor>(subcontractor);
    const { toast } = useToast();
  
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating) 
              ? 'fill-yellow-400 text-yellow-400' 
              : i < rating 
              ? 'fill-yellow-200 text-yellow-400' 
              : 'text-gray-300'
          }`}
        />
      ));
    };
  
    const handleInputChange = (field: keyof Subcontractor, value: any) => {
      setFormData((prev:any) => ({
        ...prev,
        [field]: value
      }));
    };
  
    const handleSkillsChange = (skillsString: string) => {
      const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      setFormData((prev:any) => ({
        ...prev,
        skills: skillsArray
      }));
    };
  
    const updateSubcontractorData = async (): Promise<Subcontractor> => {
      try {
        const updatedData = await updateSubcontractor(subcontractor._id, formData);
        if (!updatedData) {
          throw new Error('Failed to update subcontractor');
        }
        return updatedData;
      } catch (error) {
        throw error;
      }
    };
  
    const handleSave = async () => {
      setIsLoading(true);
      try {
        const updatedSubcontractor = await updateSubcontractorData();
        
        toast({
          title: "Success",
          description: "Subcontractor details updated successfully.",
        });
        
        setIsEditing(false);
        onUpdate?.(updatedSubcontractor);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to update subcontractor details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleCancel = () => {
      setFormData(subcontractor);
      setIsEditing(false);
    };
  
    const currentData = isEditing ? formData : subcontractor;
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl">
                {currentData.isCompany ? (
                  <>
                    <Building2 className="h-5 w-5" />
                    {currentData.companyName || 'Company'}
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    {`${currentData.firstName || ''} ${currentData.lastName || ''}`.trim() || 'Individual Contractor'}
                  </>
                )}
                <Badge variant={currentData.isActive ? "default" : "secondary"}>
                  {currentData.isActive ? "Active" : "Inactive"}
                </Badge>
              </DialogTitle>
              
              <div className="flex gap-2 mt-3">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter address"
                        rows={2}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {currentData.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{currentData.email}</span>
                      </div>
                    )}
                    {currentData.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{currentData.phone}</span>
                      </div>
                    )}
                    {currentData.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{currentData.address}</span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
  
            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        value={formData.specialty || ''}
                        onChange={(e) => handleInputChange('specialty', e.target.value)}
                        placeholder="Enter specialty"
                      />
                    </div>
                    <div>
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Textarea
                        id="skills"
                        value={formData.skills.join(', ')}
                        onChange={(e) => handleSkillsChange(e.target.value)}
                        placeholder="Enter skills separated by commas"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating">Rating (0-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating || ''}
                        onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || null)}
                        placeholder="Enter rating"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                      />
                      <Label htmlFor="isActive">Active Status</Label>
                    </div>
                  </>
                ) : (
                  <>
                    {currentData.specialty && (
                      <div>
                        <span className="text-sm font-medium">Specialty:</span>
                        <p className="text-sm text-muted-foreground">{currentData.specialty}</p>
                      </div>
                    )}
                    {currentData.skills && currentData.skills.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentData.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {currentData.rating && (
                      <div>
                        <span className="text-sm font-medium">Rating:</span>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(currentData.rating)}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({currentData.rating}/5)
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
  
            {/* Company/Individual Details */}
            {currentData.isCompany ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName || ''}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input
                          id="registrationNumber"
                          value={formData.registrationNumber || ''}
                          onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                          placeholder="Enter registration number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxPin">Tax PIN</Label>
                        <Input
                          id="taxPin"
                          value={formData.taxPin || ''}
                          onChange={(e) => handleInputChange('taxPin', e.target.value)}
                          placeholder="Enter tax PIN"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson || ''}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                          placeholder="Enter contact person name"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {currentData.registrationNumber && (
                        <div>
                          <span className="text-sm font-medium">Registration Number:</span>
                          <p className="text-sm text-muted-foreground">{currentData.registrationNumber}</p>
                        </div>
                      )}
                      {currentData.taxPin && (
                        <div>
                          <span className="text-sm font-medium">Tax PIN:</span>
                          <p className="text-sm text-muted-foreground">{currentData.taxPin}</p>
                        </div>
                      )}
                      {currentData.contactPerson && (
                        <div>
                          <span className="text-sm font-medium">Contact Person:</span>
                          <p className="text-sm text-muted-foreground">{currentData.contactPerson}</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName || ''}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName || ''}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nationalId">National ID</Label>
                        <Input
                          id="nationalId"
                          value={formData.nationalId || ''}
                          onChange={(e) => handleInputChange('nationalId', e.target.value)}
                          placeholder="Enter national ID"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {currentData.nationalId && (
                        <div>
                          <span className="text-sm font-medium">National ID:</span>
                          <p className="text-sm text-muted-foreground">{currentData.nationalId}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium">Full Name:</span>
                        <p className="text-sm text-muted-foreground">
                          {`${currentData.firstName || ''} ${currentData.lastName || ''}`.trim() || 'Not provided'}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
  
            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing ? (
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Enter additional notes"
                      rows={3}
                    />
                  </div>
                ) : (
                  <>
                    {currentData.notes && (
                      <div>
                        <span className="text-sm font-medium">Notes:</span>
                        <p className="text-sm text-muted-foreground">{currentData.notes}</p>
                      </div>
                    )}
                  </>
                )}
                <Separator />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created: {formatDate(currentData.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Updated: {formatDate(currentData.updatedAt)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {currentData._id}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default SubcontractorDialog;
  