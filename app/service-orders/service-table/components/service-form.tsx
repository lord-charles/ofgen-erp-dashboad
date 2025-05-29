import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Download, Printer, Edit3 } from 'lucide-react';
import { useServiceOrderForm, type ServiceOrderData } from '@/hooks/useServiceOrderForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const ViewServiceOrderForm = () => {
    const {
        selectedOrder,
        isFormMode,
        setIsFormMode,
        updateOrder,
        addMaterialItem,
        removeMaterialItem,
        calculateTotal,
        handlePrint,
        handleDownloadPDF,
        formatCurrency,
        printRef,
        loadSampleData,
        createNewOrder
    } = useServiceOrderForm();

    React.useEffect(() => {
        loadSampleData();
    }, [loadSampleData]);

    const handleInputChange = (field: string, value: any, parent?: string) => {
        if (!selectedOrder) return;

        let updatedOrder: ServiceOrderData;

        if (parent) {
            const parentObject = selectedOrder[parent as keyof ServiceOrderData];
            if (typeof parentObject === 'object' && parentObject !== null) {
                updatedOrder = {
                    ...selectedOrder,
                    [parent]: {
                        ...parentObject,
                        [field]: value
                    }
                };
            } else {
                updatedOrder = selectedOrder;
            }
        } else {
            updatedOrder = {
                ...selectedOrder,
                [field]: value
            };
        }

        updateOrder(updatedOrder);
    };

    const handleMaterialChange = (index: number, field: string, value: any) => {
        if (!selectedOrder) return;

        const updatedMaterials = [...selectedOrder.billOfMaterials];
        updatedMaterials[index] = {
            ...updatedMaterials[index],
            [field]: value
        };

        // Calculate total if quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
            const quantity = field === 'quantity' ? value : updatedMaterials[index].quantity;
            const rate = field === 'rate' ? value : updatedMaterials[index].rate;
            updatedMaterials[index].total = quantity * rate;
        }

        const updatedOrder = {
            ...selectedOrder,
            billOfMaterials: updatedMaterials,
            totalValue: updatedMaterials.reduce((sum, item) => sum + (item.total || 0), 0)
        };

        updateOrder(updatedOrder);
    };

    const handleSignatureChange = (field: string, value: string) => {
        if (!selectedOrder) return;

        const updatedOrder = {
            ...selectedOrder,
            signatures: {
                ...selectedOrder.signatures,
                [field]: value
            }
        };

        updateOrder(updatedOrder);
    };

    if (!selectedOrder) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                <Card className="w-96 shadow-xl border-0">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold ">Service Order Management</CardTitle>
                        <p className=" text-sm">Professional Document System</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={loadSampleData} className="w-full h-12 text-base font-semibold">
                            Load Sample Data
                        </Button>
                        <Button onClick={createNewOrder} variant="outline" className="w-full h-12 text-base">
                            Create New Order
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[90vh] p-6">
            <div className="max-w-6xl mx-auto">
                {/* Enhanced Header Actions */}
                <div className="flex justify-between items-center mb-8 no-print">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-bold  mb-2">Service Order Form</h1>
                        </div>
                        <Badge
                            variant={selectedOrder.status === 'approved' ? 'default' : 'secondary'}
                            className="px-4 py-2 text-sm font-semibold"
                        >
                            {(selectedOrder.status || '').toUpperCase()}
                        </Badge>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setIsFormMode(!isFormMode)}
                            variant="outline"
                            size="lg"
                            className="h-12 px-6"
                        >
                            <Edit3 className="h-5 w-5 mr-2" />
                            {isFormMode ? 'View Mode' : 'Edit Mode'}
                        </Button>
                        <Button onClick={async () => {await setIsFormMode(false); handlePrint()}} variant="outline" size="lg" className="h-12 px-6">
                            <Printer className="h-5 w-5 mr-2" />
                            Print
                        </Button>
                        <Button onClick={async () => {await setIsFormMode(false); handleDownloadPDF()}} size="lg" className="h-12 px-6 bg-blue-600 hover:bg-blue-700">
                            <Download className="h-5 w-5 mr-2" />
                            Download PDF
                        </Button>
                    </div>
                </div>

                {/* Professional Printable Content */}
                <div ref={printRef} className="shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
                    {/* Official Document Header */}
                    <div className="p-8 print:print: print:border-b-4 print:border-blue-900">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2 print:">SERVICE ORDER FORM</h1>
                            <div className="text-lg font-medium opacity-90 print:">
                                Official Document for Equipment and Services Procurement
                            </div>
                            <div className="mt-4 pt-4 border-t border-blue-300 ">
                                <div className="grid grid-cols-3 gap-8 text-base">
                                    <div className="text-left">
                                        <div className="font-semibold mb-1">ISSUED BY:</div>
                                        {isFormMode ? (
                                            <Input
                                                value={selectedOrder.issuedBy}
                                                onChange={(e) => handleInputChange('issuedBy', e.target.value)}
                                                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 print:print: print:border-gray-400"
                                            />
                                        ) : (
                                            <div className="font-bold text-lg print:">{selectedOrder.issuedBy}</div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold mb-1">DOCUMENT ID:</div>
                                        <div className="font-bold text-lg print:">{selectedOrder.siteDetails?.siteId || ""}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold mb-1">DATE ISSUED:</div>
                                        {isFormMode ? (
                                            <Input
                                                value={selectedOrder.serviceOrderDate}
                                                onChange={(e) => handleInputChange('serviceOrderDate', e.target.value)}
                                                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 print:print: print:border-gray-400"
                                            />
                                        ) : (
                                            <div className="font-bold text-lg print:">
                                            {selectedOrder.serviceOrderDate ? (
                                              (() => {
                                                try {
                                                  const date = new Date(selectedOrder.serviceOrderDate);
                                                  return !isNaN(date.getTime()) 
                                                    ? new Intl.DateTimeFormat('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                      }).format(date)
                                                    : 'Invalid Date';
                                                } catch {
                                                  return 'Invalid Date';
                                                }
                                              })()
                                            ) : (
                                              'No Date'
                                            )}
                                          </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Issued To Section */}
                        <Card className="border-2 border-blue-200 print:border-gray-400">
                            <CardHeader className="print:bg-gray-100">
                                <CardTitle className="text-xl font-bold  print:">SERVICE PROVIDER INFORMATION</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="mb-6">
                                    <Label className="text-base font-semibold ">Organization Name</Label>
                                    {isFormMode ? (
                                        <Input
                                            value={selectedOrder.issuedTo}
                                            onChange={(e) => handleInputChange('issuedTo', e.target.value)}
                                            className="mt-2 h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                                        />
                                    ) : (
                                        <div className="mt-2 text-xl font-semibold  p-3 rounded border print:print:border-gray-400">
                                            {selectedOrder.issuedTo}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="border-2 border-gray-200 print:border-gray-400">
                            <CardHeader className="print:bg-gray-100">
                                <CardTitle className="text-xl font-bold ">CONTACT INFORMATION</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-base font-semibold ">Physical Address</Label>
                                        {isFormMode ? (
                                            <Textarea
                                                value={selectedOrder.contactInfo?.physicalAddress || ''}
                                                onChange={(e) => handleInputChange('physicalAddress', e.target.value, 'contactInfo')}
                                                className="mt-2 min-h-[80px] border-2 border-gray-300 focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="mt-2 p-3 rounded border min-h-[80px] print:print:border-gray-400">
                                                {selectedOrder.contactInfo?.physicalAddress || ''}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-base font-semibold ">Contact Person</Label>
                                        {isFormMode ? (
                                            <Input
                                                value={selectedOrder.contactInfo?.name || ''}
                                                onChange={(e) => handleInputChange('name', e.target.value, 'contactInfo')}
                                                className="mt-2 h-12 border-2 border-gray-300 focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="mt-2 p-3 rounded border h-12 flex items-center print:print:border-gray-400">
                                                {selectedOrder.contactInfo.name}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-base font-semibold ">Telephone Number</Label>
                                        {isFormMode ? (
                                            <Input
                                                value={selectedOrder.contactInfo?.telephone || ''}
                                                onChange={(e) => handleInputChange('telephone', e.target.value, 'contactInfo')}
                                                className="mt-2 h-12 border-2 border-gray-300 focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="mt-2 p-3 rounded border h-12 flex items-center print:print:border-gray-400">
                                                {selectedOrder.contactInfo.telephone}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-base font-semibold ">Email Address</Label>
                                        {isFormMode ? (
                                            <Input
                                                value={selectedOrder.contactInfo?.email || ''}
                                                onChange={(e) => handleInputChange('email', e.target.value, 'contactInfo')}
                                                className="mt-2 h-12 border-2 border-gray-300 focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="mt-2 p-3 rounded border h-12 flex items-center print:print:border-gray-400">
                                                {selectedOrder.contactInfo.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location Information */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Location Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Region</Label>
                                    {isFormMode ? (
                                        <Input
                                            value={selectedOrder.locationInfo?.region || ''}
                                            onChange={(e) => handleInputChange('region', e.target.value, 'locationInfo')}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="mt-1">{selectedOrder.locationInfo.region}</p>
                                    )}
                                </div>
                                <div>
                                    <Label>Sub region</Label>
                                    {isFormMode ? (
                                        <Input
                                            value={selectedOrder.locationInfo?.subRegion || ''}
                                            onChange={(e) => handleInputChange('subRegion', e.target.value, 'locationInfo')}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="mt-1">{selectedOrder.locationInfo.subRegion}</p>
                                    )}
                                </div>
                                <div>
                                    <Label>Co-ordinates / address of the Site</Label>
                                    {isFormMode ? (
                                        <Input
                                            value={`${selectedOrder.locationInfo?.coordinates?.latitude ?? ''}°S ${selectedOrder.locationInfo?.coordinates?.longitude ?? ''}°E`}
                                            onChange={(e) => {
                                                // Parse coordinates from string
                                                const coords = e.target.value.split(' ');
                                                if (coords.length >= 2) {
                                                    handleInputChange('coordinates', {
                                                        latitude: parseFloat(coords[0].replace('°S', '')),
                                                        longitude: parseFloat(coords[1].replace('°E', ''))
                                                    }, 'locationInfo');
                                                }
                                            }}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="mt-1">{`${selectedOrder.locationInfo.coordinates.latitude}°S ${selectedOrder.locationInfo.coordinates.longitude}°E`}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Site Details */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Site Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <Label>Site ID</Label>
                                    {isFormMode ? (
                                        <Input
                                            value={selectedOrder.siteDetails?.siteId || ''}
                                            onChange={(e) => handleInputChange('siteId', e.target.value, 'siteDetails')}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="mt-1">{selectedOrder.siteDetails.siteId}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-5 gap-4">
                                    <div>
                                        <Label>Site Type</Label>
                                        {isFormMode ? (
                                            <Select
                                                value={selectedOrder.siteDetails?.siteType || ''}
                                                onValueChange={(value) => handleInputChange('siteType', value, 'siteDetails')}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Green Field">Green Field</SelectItem>
                                                    <SelectItem value="Roof Top">Roof Top</SelectItem>
                                                    <SelectItem value="Indoor">Indoor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="mt-1">{selectedOrder.siteDetails.siteType}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Roof Type</Label>
                                        {isFormMode ? (
                                            <Input
                                                value={selectedOrder.siteDetails?.roofType || ''}
                                                onChange={(e) => handleInputChange('roofType', e.target.value, 'siteDetails')}
                                                className="mt-1"
                                                placeholder="(please specify)"
                                            />
                                        ) : (
                                            <p className="mt-1">{selectedOrder.siteDetails?.roofType || ''}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Site Classification</Label>
                                        {isFormMode ? (
                                            <Select
                                                value={selectedOrder.siteDetails?.siteClassification || ''}
                                                onValueChange={(value) => handleInputChange('siteClassification', value, 'siteDetails')}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Hub">Hub</SelectItem>
                                                    <SelectItem value="OLT">OLT</SelectItem>
                                                    <SelectItem value="Collocation">Collocation</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="mt-1">{selectedOrder.siteDetails.siteClassification}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Last Mile</Label>
                                        {isFormMode ? (
                                            <Select
                                                value={selectedOrder.siteDetails?.lastMile || ''}
                                                onValueChange={(value) => handleInputChange('lastMile', value, 'siteDetails')}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Yes">Yes</SelectItem>
                                                    <SelectItem value="No">No</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="mt-1">{selectedOrder.siteDetails.lastMile}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Any other (please specify)</Label>
                                        {isFormMode ? (
                                            <Input
                                                value={selectedOrder.siteDetails?.other || ''}
                                                onChange={(e) => handleInputChange('other', e.target.value, 'siteDetails')}
                                                className="mt-1"
                                            />
                                        ) : (
                                            <p className="mt-1">{selectedOrder.siteDetails?.other || ''}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Design Summary */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Design Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(selectedOrder.designSummary || {}).map(([key, value]) => (
                                        <div key={key}>
                                            <Label className="text-sm font-medium">
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </Label>
                                            {isFormMode ? (
                                                <Input
                                                    value={value as string}
                                                    onChange={(e) => handleInputChange(key, e.target.value, 'designSummary')}
                                                    className="mt-1"
                                                />
                                            ) : (
                                                <p className="mt-1 text-sm">{value as string}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Bill of Materials */}
                        <Card className="border-2 border-green-200 print:border-gray-400 print:page-break-inside-avoid">
                            <CardHeader className="print:flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold  print:">COMMERCIAL INFORMATION</CardTitle>
                                    <p className=" print: mt-1">Bill of Materials & Pricing</p>
                                </div>
                                {isFormMode && (
                                    <Button onClick={addMaterialItem} size="lg" className="no-print h-12 px-6">
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add Item
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse print:text-sm">
                                        <thead>
                                            <tr className="">
                                                <th className="border-2 border-gray-300  p-4 text-left font-bold  print:">ITEM DESCRIPTION</th>
                                                <th className="border-2 border-gray-300  p-4 text-left font-bold  print:">SPECIFICATIONS</th>
                                                <th className="border-2 border-gray-300  p-4 text-left font-bold  print:">UNIT</th>
                                                <th className="border-2 border-gray-300  p-4 text-left font-bold  print:">QTY</th>
                                                <th className="border-2 border-gray-300  p-4 text-left font-bold  print:">UNIT PRICE</th>
                                                <th className="border-2 border-gray-300  p-4 text-left font-bold  print:">TOTAL AMOUNT</th>
                                                {isFormMode && <th className="border-2 border-gray-300 p-4 text-left font-bold no-print">ACTIONS</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(selectedOrder.billOfMaterials || []).map((item: { item: string; specs: string; unitOfMeasure: string; quantity: number; rate?: number; total?: number }, index: number) => (
                                                <tr key={index} className="hover:print:hover:bg-transparent">
                                                    <td className="border-2 border-gray-300  p-4">
                                                        {isFormMode ? (
                                                            <Input
                                                                value={item?.item || ''}
                                                                onChange={(e) => handleMaterialChange(index, 'item', e.target.value)}
                                                                className="border-none shadow-none text-base"
                                                            />
                                                        ) : (
                                                            <div className="font-medium ">{item.item}</div>
                                                        )}
                                                    </td>
                                                    <td className="border-2 border-gray-300  p-4">
                                                        {isFormMode ? (
                                                            <Input
                                                                value={item?.specs || ''}
                                                                onChange={(e) => handleMaterialChange(index, 'specs', e.target.value)}
                                                                className="border-none shadow-none text-base"
                                                            />
                                                        ) : (
                                                            <div className="">{item.specs}</div>
                                                        )}
                                                    </td>
                                                    <td className="border-2 border-gray-300  p-4">
                                                        {isFormMode ? (
                                                            <Input
                                                                value={item?.unitOfMeasure || ''}
                                                                onChange={(e) => handleMaterialChange(index, 'unitOfMeasure', e.target.value)}
                                                                className="border-none shadow-none text-base"
                                                            />
                                                        ) : (
                                                            <div className="">{item.unitOfMeasure}</div>
                                                        )}
                                                    </td>
                                                    <td className="border-2 border-gray-300  p-4 text-center">
                                                        {isFormMode ? (
                                                            <Input
                                                                type="number"
                                                                value={item?.quantity || 0}
                                                                onChange={(e) => handleMaterialChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                                className="border-none shadow-none text-base text-center"
                                                            />
                                                        ) : (
                                                            <div className="font-semibold ">{item.quantity}</div>
                                                        )}
                                                    </td>
                                                    <td className="border-2 border-gray-300  p-4 text-right">
                                                        {isFormMode ? (
                                                            <Input
                                                                type="number"
                                                                value={item?.rate || 0}
                                                                onChange={(e) => handleMaterialChange(index, 'rate', parseFloat(e.target.value) || 0)}
                                                                className="border-none shadow-none text-base text-right"
                                                            />
                                                        ) : (
                                                            <div className="font-semibold ">{formatCurrency(item?.rate || 0)}</div>
                                                        )}
                                                    </td>
                                                    <td className="border-2 border-gray-300  p-4 text-right">
                                                        <div className="font-bold text-lg  print:">
                                                            {formatCurrency(item?.total || 0)}
                                                        </div>
                                                    </td>
                                                    {isFormMode && (
                                                        <td className="border-2 border-gray-300 p-4 no-print">
                                                            <Button
                                                                onClick={() => removeMaterialItem(index)}
                                                                variant="destructive"
                                                                size="sm"
                                                                className="h-10 w-10 p-0"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                            <tr className="">
                                                <td colSpan={5} className="border-2 border-gray-300  p-4 text-right font-bold text-xl  print:">
                                                    GRAND TOTAL:
                                                </td>
                                                <td className="border-2 border-gray-300  p-4 text-right">
                                                    <div className="font-bold text-2xl  print:">
                                                        {formatCurrency(calculateTotal())}
                                                    </div>
                                                </td>
                                                {isFormMode && <td className="border-2 border-gray-300 p-4 no-print"></td>}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-6 print:bg-white">
                                    <div className="text-right">
                                        <p className="text-lg font-semibold  print:">
                                            <strong>Authorized Vendor:</strong> {selectedOrder.issuedBy}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Official Signature Section */}
                        <Card className="border-2 border-purple-200 print:border-gray-400 print:page-break-inside-avoid">
                            <CardHeader className="print:bg-gray-100">
                                <CardTitle className="text-xl font-bold  print:">OFFICIAL AUTHORIZATION & SIGNATURES</CardTitle>
                                <p className=" print: mt-1">Legal Document Validation</p>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <div className="grid grid-cols-2 gap-12 print:gap-8">
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <h3 className="text-lg font-bold  mb-4">CLIENT AUTHORIZATION</h3>
                                        </div>
                                        <div>
                                            <Label className="text-base font-semibold  print:">Authorized Signature</Label>
                                            <div className="border-b-3 border-gray-400  h-20 print:h-16 mt-4 relative print:bg-white">
                                                {isFormMode && (
                                                    <Textarea
                                                        value={selectedOrder.signatures?.clientSignature || ''}
                                                        onChange={(e) => handleSignatureChange('clientSignature', e.target.value)}
                                                        placeholder="Digital signature or print name"
                                                        className="border-none resize-none h-18 print:h-14 bg-transparent no-print"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-base font-semibold  print:">Authorized Representative Name</Label>
                                            {isFormMode ? (
                                                <Input
                                                    value={selectedOrder.signatures?.clientName || ''}
                                                    onChange={(e) => handleSignatureChange('clientName', e.target.value)}
                                                    className="mt-2 h-12 border-2 border-gray-300 focus:border-purple-500 print:border-gray-400"
                                                />
                                            ) : (
                                                <div className="border-b-2 border-gray-400  mt-3 h-12 print:h-10 flex items-end text-lg font-semibold">
                                                    {selectedOrder.signatures?.clientName}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Label className="text-base font-semibold  print:">Date of Authorization</Label>
                                            {isFormMode ? (
                                                <Input
                                                    type="date"
                                                    value={selectedOrder.signatures?.clientDate || ''}
                                                    onChange={(e) => handleSignatureChange('clientDate', e.target.value)}
                                                    className="mt-2 h-12 border-2 border-gray-300 focus:border-purple-500 print:border-gray-400"
                                                />
                                            ) : (
                                                <div className="border-b-2 border-gray-400  mt-3 h-12 print:h-10 flex items-end text-lg font-semibold">
                                                    {selectedOrder.signatures?.clientDate}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <h3 className="text-lg font-bold  mb-4">VENDOR CONFIRMATION</h3>
                                        </div>
                                        <div>
                                            <Label className="text-base font-semibold  print:">Authorized Signature</Label>
                                            <div className="border-b-3 border-gray-400  h-20 print:h-16 mt-4 relative print:bg-white">
                                                {isFormMode && (
                                                    <Textarea
                                                        value={selectedOrder.signatures?.vendorSignature || ''}
                                                        onChange={(e) => handleSignatureChange('vendorSignature', e.target.value)}
                                                        placeholder="Digital signature or print name"
                                                        className="border-none resize-none h-18 print:h-14 bg-transparent no-print"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-base font-semibold  print:">Authorized Representative Name</Label>
                                            {isFormMode ? (
                                                <Input
                                                    value={selectedOrder.signatures?.vendorName || ''}
                                                    onChange={(e) => handleSignatureChange('vendorName', e.target.value)}
                                                    className="mt-2 h-12 border-2 border-gray-300 focus:border-purple-500 print:border-gray-400"
                                                />
                                            ) : (
                                                <div className="border-b-2 border-gray-400  mt-3 h-12 print:h-10 flex items-end text-lg font-semibold">
                                                    {selectedOrder.signatures?.vendorName}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Label className="text-base font-semibold  print:">Date of Confirmation</Label>
                                            {isFormMode ? (
                                                <Input
                                                    type="date"
                                                    value={selectedOrder.signatures?.vendorDate || ''}
                                                    onChange={(e) => handleSignatureChange('vendorDate', e.target.value)}
                                                    className="mt-2 h-12 border-2 border-gray-300 focus:border-purple-500 print:border-gray-400"
                                                />
                                            ) : (
                                                <div className="border-b-2 border-gray-400  mt-3 h-12 print:h-10 flex items-end text-lg font-semibold">
                                                    {selectedOrder.signatures?.vendorDate}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Legal Footer */}
                                <div className="mt-12 pt-8 border-t-2 border-gray-300 ">
                                    <div className="text-center text-sm  print: space-y-2">
                                        <p className="font-semibold">This document constitutes a legally binding agreement between the parties mentioned above.</p>
                                        <p>All terms and conditions are subject to the master service agreement between the organizations.</p>
                                        <p className="text-xs mt-4 opacity-75">Document generated on {new Date().toLocaleDateString()} | Reference: {selectedOrder._id}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

export default ViewServiceOrderForm;
