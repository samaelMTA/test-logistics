import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ShipmentsService } from '../../../core/services/shipments.service';

@Component({
    selector: 'app-create-shipment-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    template: `
        <h2 mat-dialog-title>Nuevo envío</h2>

        <mat-dialog-content>
        <form [formGroup]="form" class="form">
            <mat-form-field appearance="outline" class="full-width">
            <mat-label>Dirección de origen</mat-label>
            <input matInput formControlName="originAddress" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
            <mat-label>Dirección de destino</mat-label>
            <input matInput formControlName="destinationAddress" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
            <mat-label>Destinatario</mat-label>
            <input matInput formControlName="recipientName" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
            <mat-label>Teléfono</mat-label>
            <input matInput formControlName="phone" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
            <mat-label>Peso (kg)</mat-label>
            <input matInput type="number" min="0.1" step="0.1" formControlName="weight" />
            </mat-form-field>
        </form>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
        <button mat-button (click)="close()" [disabled]="loading">Cancelar</button>
        <button
            mat-raised-button
            color="primary"
            (click)="submit()"
            [disabled]="form.invalid || loading"
        >
            {{ loading ? 'Creando...' : 'Crear envío' }}
        </button>
        </mat-dialog-actions>
    `,
    styles: [`
        .form {
        display: flex;
        flex-direction: column;
        padding-top: 8px;
        min-width: 320px;
        max-width: 500px;
        }

        .full-width {
        width: 100%;
        margin-bottom: 8px;
        }
    `],
})
export class CreateShipmentDialogComponent {
    private readonly fb = inject(FormBuilder);
    private readonly shipmentsService = inject(ShipmentsService);
    private readonly dialogRef = inject(MatDialogRef<CreateShipmentDialogComponent>);

    loading = false;

    form = this.fb.nonNullable.group({
        originAddress: ['', [Validators.required]],
        destinationAddress: ['', [Validators.required]],
        recipientName: ['', [Validators.required]],
        phone: [''],
        weight: [0, [Validators.required, Validators.min(0.1)]],
    });

    close(): void {
        this.dialogRef.close(false);
    }

    submit(): void {
        if (this.form.invalid) return;

        this.loading = true;

        const rawValue = this.form.getRawValue();

        this.shipmentsService.createShipment({
        originAddress: rawValue.originAddress,
        destinationAddress: rawValue.destinationAddress,
        recipientName: rawValue.recipientName,
        phone: rawValue.phone || undefined,
        weight: Number(rawValue.weight),
        }).subscribe({
        next: () => {
            this.loading = false;
            this.dialogRef.close(true);
        },
        error: () => {
            this.loading = false;
        },
        });
    }
}