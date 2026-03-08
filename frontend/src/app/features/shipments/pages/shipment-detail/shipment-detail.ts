import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Shipment } from '../../../../core/models/shipment.model';
import { ShipmentService } from '../../../../core/services/shipment';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule],
  templateUrl: './shipment-detail.html',
  styleUrl: './shipment-detail.scss',
})
export class ShipmentDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly shipmentService = inject(ShipmentService);

  shipment = signal<Shipment | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loading.set(true);
    this.shipmentService.getShipmentById(id).subscribe({
      next: (shipment) => {
        this.shipment.set(shipment);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
