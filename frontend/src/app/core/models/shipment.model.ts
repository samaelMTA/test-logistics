export type ShipmentStatus =
    | 'CREATED'
    | 'IN_WAREHOUSE'
    | 'IN_TRANSIT'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'RETURNED'
    | 'CANCELLED';

export interface ShipmentEvent {
    id: string;
    shipmentId: string;
    userId?: string;
    status: ShipmentStatus;
    location: string;
    notes?: string;
    createdAt: string;
}

export interface Shipment {
    id: string;
    trackingCode: string;
    originAddress: string;
    destinationAddress: string;
    recipientName: string;
    phone?: string;
    weight: string;
    status: ShipmentStatus;
    createdAt: string;
    deliveredAt?: string;
    events?: ShipmentEvent[];
}

export interface ShipmentListResponse {
    data: Shipment[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
