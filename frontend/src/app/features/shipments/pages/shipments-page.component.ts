import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CreateShipmentDialogComponent } from '../components/create-shipment-dialog.component';
import { NavbarComponent } from '../../../layout/components/navbar.component';
import { ShipmentsService } from '../../../core/services/shipments.service';
import { Shipment, ShipmentStatus } from '../../../core/models/shipment.model';

@Component({
    selector: 'app-shipments-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DatePipe,
        NavbarComponent,
        MatTableModule,
        MatCardModule,
        MatSelectModule,
        MatButtonModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatSnackBarModule,
    ],
    template: `
    <app-navbar></app-navbar>

    <div class="page">
        <div class="page-header">
            <div>
            <h1>Envíos</h1>
            <p>Gestión interna de paquetes y seguimiento</p>
            </div>

            <button mat-raised-button color="primary" (click)="openCreateDialog()">
                Nuevo envío
            </button>
        </div>

        <mat-card>
            <div class="filters">
            <mat-form-field appearance="outline">
                <mat-label>Filtrar por estado</mat-label>
                <mat-select [(ngModel)]="selectedStatus" (selectionChange)="onStatusChange()">
                <mat-option [value]="''">Todos</mat-option>
                <mat-option *ngFor="let status of statuses" [value]="status">
                    {{ formatStatus(status) }}
                </mat-option>
                </mat-select>
            </mat-form-field>
            </div>

            <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            </div>

            <div *ngIf="!loading" class="table-wrapper">
            <table mat-table [dataSource]="shipments" class="shipments-table">
                <ng-container matColumnDef="trackingCode">
                <th mat-header-cell *matHeaderCellDef>Código</th>
                <td mat-cell *matCellDef="let shipment">{{ shipment.trackingCode }}</td>
                </ng-container>

                <ng-container matColumnDef="recipientName">
                <th mat-header-cell *matHeaderCellDef>Destinatario</th>
                <td mat-cell *matCellDef="let shipment">{{ shipment.recipientName }}</td>
                </ng-container>

                <ng-container matColumnDef="destinationAddress">
                <th mat-header-cell *matHeaderCellDef>Destino</th>
                <td mat-cell *matCellDef="let shipment">{{ shipment.destinationAddress }}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let shipment">
                    <mat-chip>{{ formatStatus(shipment.status) }}</mat-chip>
                </td>
                </ng-container>

                <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let shipment">
                    {{ shipment.createdAt | date:'short' }}
                </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="clickable-row" (click)="goToDetail(row.id)">
                </tr>
            </table>

            <div *ngIf="shipments.length === 0" class="empty-state">
                No hay envíos para mostrar.
            </div>

            <mat-paginator
                [length]="total"
                [pageSize]="limit"
                [pageIndex]="page - 1"
                [pageSizeOptions]="[5, 10, 20]"
                (page)="onPageChange($event)">
            </mat-paginator>
            </div>
        </mat-card>
    </div>
    `,
    styles: [`
        .page {
            padding: 24px;
            background: #f5f5f5;
            min-height: calc(100vh - 64px);
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
            flex-wrap: wrap;
        }

        .page-header h1 {
            margin: 0 0 8px;  
        }

        .page-header p {
            margin: 0;
            color: #666;
        }

        .filters {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
        }

        .table-wrapper {
            overflow-x: auto;
        }

        .shipments-table {
            width: 100%;
        }

        .loading-container {
            display: flex;
            justify-content: center;
            padding: 32px 0;
        }

        .empty-state {
            text-align: center;
            padding: 24px;
            color: #666;
        }

        .clickable-row {
            cursor: pointer;
        }

        .clickable-row:hover {
            background: #f3f6fb;
        }
    `],
})
export class ShipmentsPageComponent implements OnInit {
    private readonly dialog = inject(MatDialog);
    private readonly shipmentsService = inject(ShipmentsService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly router = inject(Router);

    displayedColumns: string[] = [
        'trackingCode',
        'recipientName',
        'destinationAddress',
        'status',
        'createdAt',
    ];

    shipments: Shipment[] = [];
    loading = false;

    page = 1;
    limit = 10;
    total = 0;

    selectedStatus: ShipmentStatus | '' = '';

    statuses: ShipmentStatus[] = [
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
        this.loading = true;

        this.shipmentsService
        .getShipments(
            this.page,
            this.limit,
            this.selectedStatus || undefined,
        )
        .subscribe({
            next: (response) => {
            this.shipments = response.data;
            this.total = response.meta.total;
            this.page = response.meta.page;
            this.limit = response.meta.limit;
            this.loading = false;
            },
            error: () => {
            this.loading = false;
            this.snackBar.open('No se pudieron cargar los envíos', 'Cerrar', {
                duration: 3000,
            });
            },
        });
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(CreateShipmentDialogComponent, {
            width: '520px',
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((created) => {
            if (created) {
            this.snackBar.open('Envío creado correctamente', 'Cerrar', {
                duration: 3000,
            });
            this.page = 1;
            this.loadShipments();
            }
        });
    }

    goToDetail(shipmentId: string): void {
        this.router.navigate(['/shipments', shipmentId]);
    }
    
    onStatusChange(): void {
        this.page = 1;
        this.loadShipments();
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.loadShipments();
    }

    formatStatus(status: string): string {
        return status
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
}
