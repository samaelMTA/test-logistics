import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipment, ShipmentListResponse, ShipmentStatus } from '../models/shipment.model';

export interface CreateShipmentRequest {
    originAddress: string;
    destinationAddress: string;
    recipientName: string;
    phone?: string;
    weight: number;
}

export interface UpdateShipmentStatusRequest {
    status: ShipmentStatus;
    location: string;
    notes?: string;
}

@Injectable({
    providedIn: 'root',
})
export class ShipmentsService {
    private readonly apiUrl = 'http://localhost:3000';

    constructor(private readonly http: HttpClient) { }

    getShipments(
        page = 1,
        limit = 10,
        status?: ShipmentStatus,
    ): Observable<ShipmentListResponse> {
        let params = new HttpParams()
        .set('page', page)
        .set('limit', limit);

        if (status) {
        params = params.set('status', status);
        }

        return this.http.get<ShipmentListResponse>(`${this.apiUrl}/shipments`, {
        params,
        });
    }

    getShipmentById(id: string): Observable<Shipment> {
        return this.http.get<Shipment>(`${this.apiUrl}/shipments/${id}`);
    }

    createShipment(payload: CreateShipmentRequest): Observable<Shipment> {
        return this.http.post<Shipment>(`${this.apiUrl}/shipments`, payload);
    }

    updateShipmentStatus(
        id: string,
        payload: UpdateShipmentStatusRequest,
    ): Observable<Shipment> {
        return this.http.patch<Shipment>(
        `${this.apiUrl}/shipments/${id}/status`,
        payload,
        );
    }
}
