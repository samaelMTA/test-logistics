import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Shipment } from '../../../../core/models/shipment.model';
import { TrackingService } from '../../../../core/services/tracking';

@Component({
  selector: 'app-public-tracking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './public-tracking.html',
  styleUrl: './public-tracking.scss',
})
export class PublicTracking {
  private readonly fb = inject(FormBuilder);
  private readonly trackingService = inject(TrackingService);

  result = signal<Shipment | null>(null);
  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    trackingCode: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const trackingCode = this.form.getRawValue().trackingCode as string;

    this.loading.set(true);
    this.error.set('');
    this.result.set(null);

    this.trackingService.trackByCode(trackingCode).subscribe({
      next: (response) => {
        this.result.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Tracking code not found');
        this.loading.set(false);
      },
    });
  }
}
