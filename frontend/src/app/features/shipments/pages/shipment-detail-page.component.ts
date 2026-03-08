import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../../layout/components/navbar.component';
import { Shipment, ShipmentStatus } from '../../../core/models/shipment.model';
import { ShipmentsService } from '../../../core/services/shipments.service';

@Component({
    selector: 'app-shipment-detail-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        DatePipe,
        NavbarComponent,
        MatCardModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
    ],
    template: `
        <app-navbar></app-navbar>

        <div class="page">
        <div class="page-header">
            <div>
            <button mat-button routerLink="/shipments">← Volver</button>
            <h1>Detalle del envío</h1>
            </div>
        </div>

        <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
        </div>

        <ng-container *ngIf="!loading && shipment">
            <div class="grid">
            <mat-card>
                <h2>Información general</h2>
                <div class="info-grid">
                <div><strong>Código:</strong> {{ shipment.trackingCode }}</div>
                <div><strong>Estado:</strong> {{ formatStatus(shipment.status) }}</div>
                <div><strong>Destinatario:</strong> {{ shipment.recipientName }}</div>
                <div><strong>Teléfono:</strong> {{ shipment.phone || '—' }}</div>
                <div><strong>Origen:</strong> {{ shipment.originAddress }}</div>
                <div><strong>Destino:</strong> {{ shipment.destinationAddress }}</div>
                <div><strong>Peso:</strong> {{ shipment.weight }} kg</div>
                <div><strong>Creado:</strong> {{ shipment.createdAt | date:'medium' }}</div>
                <div>
                    <strong>Entregado:</strong>
                    {{ shipment.deliveredAt ? (shipment.deliveredAt | date:'medium') : '—' }}
                </div>
                </div>
            </mat-card>

            <mat-card>
                <h2>Cambiar estado</h2>

                <form [formGroup]="statusForm" (ngSubmit)="submitStatusUpdate()" class="form">
                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Nuevo estado</mat-label>
                    <mat-select formControlName="status">
                    <mat-option *ngFor="let status of availableStatuses" [value]="status">
                        {{ formatStatus(status) }}
                    </mat-option>
                    </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Ubicación</mat-label>
                    <input matInput formControlName="location" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Notas</mat-label>
                    <textarea matInput rows="4" formControlName="notes"></textarea>
                </mat-form-field>

                <button
                    mat-raised-button
                    color="primary"
                    type="submit"
                    [disabled]="statusForm.invalid || saving || availableStatuses.length === 0"
                >
                    {{ saving ? 'Actualizando...' : 'Actualizar estado' }}
                </button>
                </form>

                <p *ngIf="availableStatuses.length === 0" class="hint">
                Este envío no tiene más transiciones disponibles.
                </p>
            </mat-card>
            </div>

            <mat-card class="history-card">
            <h2>Historial de eventos</h2>

            <div *ngIf="shipment.events?.length; else noEvents" class="timeline">
                <div *ngFor="let event of shipment.events" class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-title">
                    {{ formatStatus(event.status) }}
                    </div>
                    <div><strong>Ubicación:</strong> {{ event.location }}</div>
                    <div><strong>Notas:</strong> {{ event.notes || '—' }}</div>
                    <div><strong>Fecha:</strong> {{ event.createdAt | date:'medium' }}</div>
                </div>
                </div>
            </div>

            <ng-template #noEvents>
                <p>No hay eventos registrados.</p>
            </ng-template>
            </mat-card>
        </ng-container>
        </div>
    `,
    styles: [`
        .page {
            padding: 24px;
            background: #f5f5f5;
            min-height: calc(100vh - 64px);
        }

        .page-header {
            margin-bottom: 24px;
        }

        .page-header h1 {
            margin: 8px 0 0;
        }

        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 24px;
        }

        .info-grid {
            display: grid;
            gap: 12px;
            margin-top: 16px;
        }

        .form {
            margin-top: 16px;
        }

        .full-width {
            width: 100%;
            margin-bottom: 12px;
        }

        .history-card {
            margin-top: 24px;
        }

        .timeline {
            margin-top: 16px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .timeline-item {
            display: flex;
            gap: 12px;
            align-items: flex-start;
        }

        .timeline-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #3f51b5;
            margin-top: 6px;
            flex-shrink: 0;
        }

        .timeline-content {
            background: #fafafa;
            padding: 12px 16px;
            border-radius: 8px;
            width: 100%;
        }

        .timeline-title {
            font-weight: 600;
            margin-bottom: 6px;
        }

        .loading-container {
            display: flex;
            justify-content: center;
            padding: 32px 0;
        }

        .hint {
            margin-top: 12px;
            color: #666;
        }

        @media (max-width: 900px) {
            .grid {
                grid-template-columns: 1fr;
            }
        }
    `],
})
export class ShipmentDetailPageComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly shipmentsService = inject(ShipmentsService);
    private readonly snackBar = inject(MatSnackBar);

    shipment: Shipment | null = null;
    loading = false;
    saving = false;
    shipmentId = '';

    statusForm = this.fb.nonNullable.group({
        status: ['CREATED' as ShipmentStatus, [Validators.required]],
        location: ['', [Validators.required]],
        notes: [''],
    });

    readonly allowedTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
        CREATED: ['IN_WAREHOUSE', 'CANCELLED'],
        IN_WAREHOUSE: ['IN_TRANSIT', 'RETURNED', 'CANCELLED'],
        IN_TRANSIT: ['OUT_FOR_DELIVERY', 'RETURNED', 'CANCELLED'],
        OUT_FOR_DELIVERY: ['DELIVERED', 'RETURNED', 'CANCELLED'],
        DELIVERED: [],
        RETURNED: ['CANCELLED'],
        CANCELLED: [],
    };

    get availableStatuses(): ShipmentStatus[] {
        if (!this.shipment) return [];
        return this.allowedTransitions[this.shipment.status] || [];
    }

    ngOnInit(): void {
        this.shipmentId = this.route.snapshot.paramMap.get('id') || '';
        this.loadShipment();
    }

    loadShipment(): void {
        if (!this.shipmentId) return;

        this.loading = true;

        this.shipmentsService.getShipmentById(this.shipmentId).subscribe({
        next: (shipment) => {
            this.shipment = shipment;
            this.loading = false;

            const nextStatuses = this.allowedTransitions[shipment.status] || [];
            if (nextStatuses.length > 0) {
            this.statusForm.patchValue({
                status: nextStatuses[0],
            });
            }
        },
        error: () => {
            this.loading = false;
            this.snackBar.open('No se pudo cargar el detalle del envío', 'Cerrar', {
            duration: 3000,
            });
        },
        });
    }

    submitStatusUpdate(): void {
        if (this.statusForm.invalid || !this.shipment) return;

        this.saving = true;

        const formValue = this.statusForm.getRawValue();

        this.shipmentsService
        .updateShipmentStatus(this.shipment.id, {
            status: formValue.status,
            location: formValue.location,
            notes: formValue.notes || undefined,
        })
        .subscribe({
            next: (updatedShipment) => {
            this.shipment = updatedShipment;
            this.saving = false;

            const nextStatuses = this.allowedTransitions[updatedShipment.status] || [];
            this.statusForm.reset({
                status: nextStatuses[0] ?? updatedShipment.status,
                location: '',
                notes: '',
            });

            this.snackBar.open('Estado actualizado correctamente', 'Cerrar', {
                duration: 3000,
            });
            },
            error: () => {
            this.saving = false;
            this.snackBar.open('No se pudo actualizar el estado', 'Cerrar', {
                duration: 3000,
            });
            },
        });
    }

    formatStatus(status: string): string {
        return status
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
}