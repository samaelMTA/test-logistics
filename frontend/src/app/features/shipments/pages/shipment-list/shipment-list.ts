import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Shipment, ShipmentStatus } from '../../../../core/models/shipment.model';
import { ShipmentService } from '../../../../core/services/shipment';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    MatTableModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
  ],
  templateUrl: './shipment-list.html',
  styleUrl: './shipment-list.scss',
})
export class ShipmentList implements OnInit {
  private readonly shipmentService = inject(ShipmentService);
  private readonly router = inject(Router);

  displayedColumns = ['trackingCode', 'recipientName', 'destinationAddress', 'status', 'createdAt', 'actions'];

  shipments = signal<Shipment[]>([]);
  loading = signal(false);
  total = signal(0);
  page = signal(1);
  limit = signal(10);
  selectedStatus = signal<ShipmentStatus | undefined>(undefined);

  statusOptions: ShipmentStatus[] = [
    'CREATED',
    'IN_WAREHOUSE',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'RETURNED',
    'CANCELLED',
  ];

  ngOnInit(): void {
    this.loadShipments();
  }

  loadShipments(): void {
    this.loading.set(true);

    this.shipmentService
      .getShipments(this.page(), this.limit(), this.selectedStatus())
      .subscribe({
        next: (response) => {
          this.shipments.set(response.data);
          this.total.set(response.meta.total);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  onStatusChange(status?: ShipmentStatus): void {
    this.selectedStatus.set(status || undefined);
    this.page.set(1);
    this.loadShipments();
  }

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.limit.set(event.pageSize);
    this.loadShipments();
  }

  goToDetail(id: string): void {
    this.router.navigate(['/shipments', id]);
  }
}
