import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { Shipment } from '../../../core/models/shipment.model';
import { ShipmentsService } from '../../../core/services/shipments.service';

@Component({
    selector: 'app-public-tracking-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        DatePipe,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
    ],
    template: `
        <div class="page">
            <div class="header">
                <div>
                <h1>Tracking de envío</h1>
                <p>Consulta el estado actual de tu paquete con el código de seguimiento</p>
                </div>

                <a routerLink="/login">
                <button mat-stroked-button>Acceso operadores</button>
                </a>
            </div>

            <mat-card class="search-card">
                <form [formGroup]="form" (ngSubmit)="search()">
                <div class="search-row">
                    <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Código de seguimiento</mat-label>
                    <input
                        matInput
                        formControlName="trackingCode"
                        placeholder="ENV-20260307-0001"
                    />
                    </mat-form-field>

                    <button
                    mat-raised-button
                    color="primary"
                    type="submit"
                    [disabled]="form.invalid || loading"
                    >
                    {{ loading ? 'Buscando...' : 'Buscar' }}
                    </button>
                </div>
                </form>
            </mat-card>

            <div *ngIf="loading" class="loading-container">
                <mat-spinner diameter="40"></mat-spinner>
            </div>

            <ng-container *ngIf="!loading && shipment">
                <mat-card class="result-card">
                <h2>Estado actual</h2>

                <div class="info-grid">
                    <div><strong>Código:</strong> {{ shipment.trackingCode }}</div>
                    <div><strong>Estado:</strong> {{ formatStatus(shipment.status) }}</div>
                    <div><strong>Destinatario:</strong> {{ shipment.recipientName }}</div>
                    <div><strong>Origen:</strong> {{ shipment.originAddress }}</div>
                    <div><strong>Destino:</strong> {{ shipment.destinationAddress }}</div>
                    <div><strong>Fecha de creación:</strong> {{ shipment.createdAt | date:'medium' }}</div>
                    <div>
                    <strong>Fecha de entrega:</strong>
                    {{ shipment.deliveredAt ? (shipment.deliveredAt | date:'medium') : 'Pendiente' }}
                    </div>
                </div>
                </mat-card>

                <mat-card class="history-card">
                <h2>Historial</h2>

                <div *ngIf="shipment.events?.length; else noEvents" class="timeline">
                    <div *ngFor="let event of shipment.events" class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-title">{{ formatStatus(event.status) }}</div>
                        <div><strong>Ubicación:</strong> {{ event.location }}</div>
                        <div><strong>Notas:</strong> {{ event.notes || '—' }}</div>
                        <div><strong>Fecha:</strong> {{ event.createdAt | date:'medium' }}</div>
                    </div>
                    </div>
                </div>

                <ng-template #noEvents>
                    <p>No hay eventos para este envío.</p>
                </ng-template>
                </mat-card>
            </ng-container>
        </div>
    `,
    styles: [`
        .page {
            min-height: 100vh;
            background: #f5f5f5;
            padding: 24px;
        }

        .header {
            max-width: 1000px;
            margin: 0 auto 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
        }

        .header h1 {
            margin: 0 0 8px;
        }

        .header p {
            margin: 0;
            color: #666;
        }

        .search-card, .result-card, .history-card {
            max-width: 1000px;
            margin: 0 auto 24px;
        }

        .search-row {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 16px;
            align-items: start;
        }

        .full-width {
            width: 100%;
        }

        .info-grid {
            display: grid;
            gap: 12px;
            margin-top: 16px;
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

        @media (max-width: 700px) {
            .search-row {
                grid-template-columns: 1fr;
            }
        }
    `],
})
export class PublicTrackingPageComponent {
    private readonly fb = inject(FormBuilder);
    private readonly shipmentsService = inject(ShipmentsService);
    private readonly snackBar = inject(MatSnackBar);

    loading = false;
    shipment: Shipment | null = null;

    form = this.fb.nonNullable.group({
        trackingCode: ['', [Validators.required]],
    });

    search(): void {
        if (this.form.invalid) return;

        this.loading = true;
        this.shipment = null;

        const trackingCode = this.form.getRawValue().trackingCode.trim();

        this.shipmentsService.getTrackingByCode(trackingCode).subscribe({
        next: (shipment) => {
            this.shipment = shipment;
            this.loading = false;
        },
        error: () => {
            this.loading = false;
            this.snackBar.open('No se encontró ningún envío con ese código', 'Cerrar', {
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