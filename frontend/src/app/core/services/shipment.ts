import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginatedShipments, Shipment, ShipmentStatus } from '../models/shipment.model';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  constructor(private readonly http: HttpClient) {}

  getShipments(page = 1, limit = 10, status?: ShipmentStatus): Observable<PaginatedShipments> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedShipments>(`${environment.apiUrl}/shipments`, {
      params,
    });
  }

  getShipmentById(id: string): Observable<Shipment> {
    return this.http.get<Shipment>(`${environment.apiUrl}/shipments/${id}`);
  }

  createShipment(payload: {
    originAddress: string;
    destinationAddress: string;
    recipientName: string;
    phone?: string;
    weight: number;
  }): Observable<Shipment> {
    return this.http.post<Shipment>(`${environment.apiUrl}/shipments`, payload);
  }

  updateStatus(
    id: string,
    payload: { status: ShipmentStatus; location: string; notes?: string },
  ): Observable<Shipment> {
    return this.http.patch<Shipment>(
      `${environment.apiUrl}/shipments/${id}/status`,
      payload,
    );
  }
}