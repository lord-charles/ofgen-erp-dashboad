import { useState, useCallback, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export interface ServiceOrderData {
    _id: string;
    issuedBy: string;
    issuedTo: string;
    serviceOrderDate: string;
    contactInfo: {
        name: string;
        telephone: string;
        email: string;
        physicalAddress?: string;
    };
    locationInfo: {
        region: string;
        subRegion: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    siteDetails: {
        siteId: string;
        siteType?: string;
        roofType?: string;
        siteClassification?: string;
        lastMile?: string;
        other?: string;
    };
    designSummary: Record<string, any>;
    billOfMaterials: Array<{
        item: string;
        specs: string;
        unitOfMeasure: string;
        quantity: number;
        rate?: number;
        total?: number;
    }>;
    status: string;
    totalValue?: number;
    comments?: string;
    createdAt: string;
    updatedAt: string;
    approval?: {
        approvedBy: string;
        approvedDate: string;
        approvalComments?: string;
    };
    signatures?: {
        clientSignature?: string;
        clientName?: string;
        clientDate?: string;
        vendorSignature?: string;
        vendorName?: string;
        vendorDate?: string;
    };
}

export const useServiceOrderForm = () => {
    const [serviceOrders, setServiceOrders] = useState<ServiceOrderData[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<ServiceOrderData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormMode, setIsFormMode] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const defaultOrder: ServiceOrderData = {
    _id: '',
    issuedBy: '',
    issuedTo: '',
    serviceOrderDate: '',
    contactInfo: {
        name: '',
        telephone: '',
        email: '',
        physicalAddress: '',
    },
    locationInfo: {
        region: '',
        subRegion: '',
        coordinates: {
            latitude: 0,
            longitude: 0,
        },
    },
    siteDetails: {
        siteId: '',
        siteType: '',
        roofType: '',
        siteClassification: '',
        lastMile: '',
        other: '',
    },
    designSummary: {},
    billOfMaterials: [],
    status: '',
    totalValue: 0,
    comments: '',
    createdAt: '',
    updatedAt: '',
    approval: {
        approvedBy: '',
        approvedDate: '',
        approvalComments: '',
    },
    signatures: {
        clientSignature: '',
        clientName: '',
        clientDate: '',
        vendorSignature: '',
        vendorName: '',
        vendorDate: '',
    },
};

const loadSampleData = useCallback(() => {
    const storedOrder = localStorage.getItem('selectedServiceOrder');
    if (storedOrder) {
        const parsedOrder = JSON.parse(storedOrder);
        // Normalize loaded order
        const normalizedOrder: ServiceOrderData = {
            ...defaultOrder,
            ...parsedOrder,
            contactInfo: {
                ...defaultOrder.contactInfo,
                ...(parsedOrder.contactInfo || {})
            },
            locationInfo: {
                ...defaultOrder.locationInfo,
                ...(parsedOrder.locationInfo || {}),
                coordinates: {
                    ...defaultOrder.locationInfo.coordinates,
                    ...((parsedOrder.locationInfo && parsedOrder.locationInfo.coordinates) || {})
                }
            },
            siteDetails: {
                ...defaultOrder.siteDetails,
                ...(parsedOrder.siteDetails || {})
            },
            designSummary: {
                ...defaultOrder.designSummary,
                ...(parsedOrder.designSummary || {})
            },
            billOfMaterials: parsedOrder.billOfMaterials || [],
            approval: {
                ...defaultOrder.approval,
                ...(parsedOrder.approval || {})
            },
            signatures: {
                ...defaultOrder.signatures,
                ...(parsedOrder.signatures || {})
            },
        };
        setServiceOrders([normalizedOrder]);
        setSelectedOrder(normalizedOrder);
        return;
    }

        const sampleData: ServiceOrderData[] = [
            {
                "_id": "SO-2024-001",
                "issuedBy": "SAFARICOM PLC",
                "issuedTo": "OFGEN Limited",
                "serviceOrderDate": "2/4/2025",
                "contactInfo": {
                    "name": "Cyrus Kamau Wanyoike",
                    "telephone": "0722218127",
                    "email": "CWanyoike1@Safaricom.co.ke",
                    "physicalAddress": "SAFARICOM HQ III"
                },
                "locationInfo": {
                    "region": "RIFT VALLEY",
                    "subRegion": "NAKURU",
                    "coordinates": {
                        "latitude": -0.812790,
                        "longitude": 36.390840
                    }
                },
                "siteDetails": {
                    "siteId": "13632_RV_NO1029-Longonot_Farm_OUTN_MGF",
                    "siteType": "Green Field",
                    "roofType": "N/A",
                    "siteClassification": "Hub",
                    "lastMile": "Yes",
                    "other": ""
                },
                "designSummary": {
                    "existingPowerSupply": "Grid+ Solar + DG",
                    "gridDgBatteries": "Grid+ DG+ Batteries",
                    "sitePowerDemandDailyEnergyDemand": "73.69 kWH",
                    "solarDesignLimitation": "Space, load",
                    "proposedSolarCapacity": "9.28kWp",
                    "proposedBatteryCapacity": "700AH(HUAWEI CloudLi ESM 48100B1)",
                    "proposedRectifierCapacity": "36Kw (Huawei ICC330 H1-C12)",
                    "estimatedSolarProductionPerMonth": "1,059.3 kWH",
                    "solarPenetration": "48%",
                    "commentOnGeneratorRecovery": "Generator recovery due to the achievement of the 8hr B.H.T",
                    "dabApprovalComments": "Approved"
                },
                "billOfMaterials": [
                    {
                        "item": "Li Battery Capacity (Ah)",
                        "specs": "100AH",
                        "unitOfMeasure": "Pcs",
                        "quantity": 7,
                        "rate": 25000,
                        "total": 175000
                    },
                    {
                        "item": "Li Battery Capacity (Ah)",
                        "specs": "130AH",
                        "unitOfMeasure": "Pcs",
                        "quantity": 3,
                        "rate": 32000,
                        "total": 96000
                    },
                    {
                        "item": "Li Battery Capacity (Ah)",
                        "specs": "200AH",
                        "unitOfMeasure": "Pcs",
                        "quantity": 2,
                        "rate": 45000,
                        "total": 90000
                    },
                    {
                        "item": "Rectifier Capacity",
                        "specs": "36kw",
                        "unitOfMeasure": "Pcs",
                        "quantity": 1,
                        "rate": 85000,
                        "total": 85000
                    },
                    {
                        "item": "Generator",
                        "specs": "100kva",
                        "unitOfMeasure": "Pcs",
                        "quantity": 1,
                        "rate": 120000,
                        "total": 120000
                    },
                    {
                        "item": "Inverter",
                        "specs": "5kva",
                        "unitOfMeasure": "Pcs",
                        "quantity": 2,
                        "rate": 35000,
                        "total": 70000
                    },
                    {
                        "item": "Combiner yellow-Green",
                        "specs": "25mm2 (Box-Blue/Gray)",
                        "unitOfMeasure": "Meters",
                        "quantity": 500,
                        "rate": 150,
                        "total": 75000
                    },
                    {
                        "item": "Combiner yellow-Green",
                        "specs": "35mm2 (Box-Blue/Gray)",
                        "unitOfMeasure": "Meters",
                        "quantity": 300,
                        "rate": 200,
                        "total": 60000
                    },
                    {
                        "item": "Combiner yellow-Green",
                        "specs": "16mm2 (Box-Blue/Gray)",
                        "unitOfMeasure": "Meters",
                        "quantity": 200,
                        "rate": 120,
                        "total": 24000
                    },
                    {
                        "item": "Combiner Port",
                        "specs": "25mm2 (Box-Yellow/Green)",
                        "unitOfMeasure": "Meters",
                        "quantity": 400,
                        "rate": 180,
                        "total": 72000
                    },
                    {
                        "item": "Cable Raceway",
                        "specs": "10mm2 AC or Cable",
                        "unitOfMeasure": "Meters",
                        "quantity": 250,
                        "rate": 80,
                        "total": 20000
                    },
                    {
                        "item": "Distribution Panel",
                        "specs": "16mm2 AC power cable",
                        "unitOfMeasure": "Units",
                        "quantity": 3,
                        "rate": 15000,
                        "total": 45000
                    },
                    {
                        "item": "Flux Conduit",
                        "specs": "32mm2 flex Conduit",
                        "unitOfMeasure": "Meters",
                        "quantity": 150,
                        "rate": 120,
                        "total": 18000
                    },
                    {
                        "item": "PVC Conduit",
                        "specs": "25mm2 flex Conduit",
                        "unitOfMeasure": "Meters",
                        "quantity": 100,
                        "rate": 90,
                        "total": 9000
                    },
                    {
                        "item": "Aluminium Tray",
                        "specs": "4S",
                        "unitOfMeasure": "Meters",
                        "quantity": 75,
                        "rate": 350,
                        "total": 26250
                    },
                    {
                        "item": "UV Cable 16mm2x50mm",
                        "specs": "4S",
                        "unitOfMeasure": "Meters",
                        "quantity": 80,
                        "rate": 180,
                        "total": 14400
                    },
                    {
                        "item": "Other Specification Material",
                        "specs": "2.5*2",
                        "unitOfMeasure": "Pcs",
                        "quantity": 5,
                        "rate": 2500,
                        "total": 12500
                    },
                    {
                        "item": "Wire Solution",
                        "specs": "2.5X",
                        "unitOfMeasure": "Pcs",
                        "quantity": 3,
                        "rate": 1800,
                        "total": 5400
                    },
                    {
                        "item": "Equipment Rack (Concrete, Cable rack)",
                        "specs": "Excavation, Cubic mtrs",
                        "unitOfMeasure": "M³",
                        "quantity": 12,
                        "rate": 850,
                        "total": 10200
                    },
                    {
                        "item": "Solar Structure",
                        "specs": "Concrete, Cable rack",
                        "unitOfMeasure": "M³",
                        "quantity": 8,
                        "rate": 1200,
                        "total": 9600
                    }
                ],
                "status": "pending",
                "totalValue": 1048350,
                "comments": "All materials ready for deployment. Site survey completed.",
                "createdAt": "2025-05-26T18:00:27.015Z",
                "updatedAt": "2025-05-26T18:54:07.675Z",
                "signatures": {
                    "clientSignature": "",
                    "clientName": "",
                    "clientDate": "",
                    "vendorSignature": "",
                    "vendorName": "SAFARICOM PLC",
                    "vendorDate": ""
                }
            }
        ];

        setServiceOrders(sampleData);
        setSelectedOrder(sampleData[0]);
    }, []);

    // Create new service order
    const createNewOrder = useCallback(() => {
        const newOrder: ServiceOrderData = {
            "_id": `SO-${Date.now()}`,
            "issuedBy": "SAFARICOM PLC",
            "issuedTo": "",
            "serviceOrderDate": new Date().toLocaleDateString(),
            "contactInfo": {
                "name": "",
                "telephone": "",
                "email": "",
                "physicalAddress": ""
            },
            "locationInfo": {
                "region": "",
                "subRegion": "",
                "coordinates": {
                    "latitude": 0,
                    "longitude": 0
                }
            },
            "siteDetails": {
                "siteId": "",
                "siteType": "",
                "roofType": "",
                "siteClassification": "",
                "lastMile": "",
                "other": ""
            },
            "designSummary": {},
            "billOfMaterials": [],
            "status": "draft",
            "totalValue": 0,
            "comments": "",
            "createdAt": new Date().toISOString(),
            "updatedAt": new Date().toISOString(),
            "signatures": {
                "clientSignature": "",
                "clientName": "",
                "clientDate": "",
                "vendorSignature": "",
                "vendorName": "SAFARICOM PLC",
                "vendorDate": ""
            }
        };

        setSelectedOrder(newOrder);
        setIsFormMode(true);
    }, []);

    // Update service order
    const updateOrder = useCallback((updatedOrder: ServiceOrderData) => {
        setSelectedOrder(updatedOrder);
        setServiceOrders(prev =>
            prev.map(order =>
                order._id === updatedOrder._id ? updatedOrder : order
            )
        );
    }, []);

    // Add material item
    const addMaterialItem = useCallback(() => {
        if (!selectedOrder) return;

        const newItem = {
            item: "",
            specs: "",
            unitOfMeasure: "",
            quantity: 0,
            rate: 0,
            total: 0
        };

        const updatedOrder = {
            ...selectedOrder,
            billOfMaterials: [...selectedOrder.billOfMaterials, newItem]
        };

        updateOrder(updatedOrder);
    }, [selectedOrder, updateOrder]);

    // Remove material item
    const removeMaterialItem = useCallback((index: number) => {
        if (!selectedOrder) return;

        const updatedOrder = {
            ...selectedOrder,
            billOfMaterials: selectedOrder.billOfMaterials.filter((_, i) => i !== index)
        };

        updateOrder(updatedOrder);
    }, [selectedOrder, updateOrder]);

    // Calculate total value
    const calculateTotal = useCallback(() => {
        if (!selectedOrder) return 0;

        return selectedOrder.billOfMaterials.reduce((sum, item) => sum + (item.total || 0), 0);
    }, [selectedOrder]);

    // Enhanced Print functionality with professional styling
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Service_Order_${selectedOrder?.siteDetails.siteId || selectedOrder?._id}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 0.75in 0.5in;
            }
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                body { 
                    font-family: 'Times New Roman', serif;
                    font-size: 11pt;
                    line-height: 1.4;
                    color: #000;
                }
                .no-print { 
                    display: none !important; 
                }
                .print-break { 
                    page-break-before: always; 
                }
                table { 
                    border-collapse: collapse; 
                    width: 100%; 
                    margin: 0;
                }
                th, td { 
                    border: 2px solid #000 !important; 
                    padding: 8px !important; 
                    font-size: 10pt !important;
                    vertical-align: top;
                }
                th {
                    background-color: #f0f0f0 !important;
                    font-weight: bold !important;
                    text-align: center !important;
                }
                .signature-section { 
                    margin-top: 40px; 
                    page-break-inside: avoid;
                }
                .signature-line { 
                    border-bottom: 2px solid #000 !important; 
                    min-height: 50px; 
                    margin-top: 10px;
                }
                h1, h2, h3 {
                    color: #000 !important;
                    font-weight: bold !important;
                }
                .card {
                    border: 2px solid #000 !important;
                    margin-bottom: 20px !important;
                    page-break-inside: avoid;
                }
                .gradient-header {
                    background: #f8f9fa !important;
                    border-bottom: 3px solid #000 !important;
                }
            }
        `
    });

    // Generate PDF download
    const handleDownloadPDF = useCallback(async () => {
        if (!selectedOrder) return;

        try {
            handlePrint();
        } catch (err) {
            setError('Failed to generate PDF');
        }
    }, [selectedOrder, handlePrint]);

    // Format currency
    const formatCurrency = useCallback((amount: number = 0) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    }, []);

    // Format date
    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, []);

    // Format field name for display
    const formatFieldName = useCallback((fieldName: string) => {
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }, []);

    return {
        serviceOrders,
        selectedOrder,
        loading,
        error,
        isFormMode,
        printRef,
        loadSampleData,
        createNewOrder,
        setSelectedOrder,
        setIsFormMode,
        updateOrder,
        addMaterialItem,
        removeMaterialItem,
        calculateTotal,
        handlePrint,
        handleDownloadPDF,
        formatCurrency,
        formatDate,
        formatFieldName
    };
};
