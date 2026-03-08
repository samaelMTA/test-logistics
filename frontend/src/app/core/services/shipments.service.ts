import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShipmentListResponse, ShipmentStatus } from '../models/shipment.model';

@Injectable({
    providedIn: 'root',
})
export class ShipmentsService {
    private readonly apiUrl = 'http://localhost:3000';

    constructor(private readonly http: HttpClient) { }

    getShipments(page = 1, limit = 10, status?: ShipmentStatus): Observable<ShipmentListResponse> {
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
}
