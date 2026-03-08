import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Shipment } from '../models/shipment.model';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  constructor(private readonly http: HttpClient) {}

  trackByCode(trackingCode: string): Observable<Shipment> {
    return this.http.get<Shipment>(`${environment.apiUrl}/tracking/${trackingCode}`);
  }
}