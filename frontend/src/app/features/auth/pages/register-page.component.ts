import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
    ],
    template: `
        <div class="auth-container">
            <mat-card class="auth-card">
                <h1>Registrar operador</h1>
                <p>Solo disponible para supervisores</p>

                <form [formGroup]="form" (ngSubmit)="submit()">
                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" formControlName="email" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Contraseña</mat-label>
                    <input matInput type="password" formControlName="password" />
                </mat-form-field>

                <button mat-raised-button color="primary" class="full-width" [disabled]="form.invalid || loading">
                    {{ loading ? 'Registrando...' : 'Registrar operador' }}
                </button>
                </form>

                <button mat-button routerLink="/shipments">Ir a envíos</button>
            </mat-card>
        </div>
    `,
    styles: [`
        .auth-container {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f5f5f5;
        padding: 16px;
        }

        .auth-card {
        width: 100%;
        max-width: 420px;
        padding: 24px;
        }

        .full-width {
        width: 100%;
        margin-bottom: 12px;
        }
    `],
})
export class RegisterPageComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly snackBar = inject(MatSnackBar);

    loading = false;

    form = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    submit(): void {
        if (this.form.invalid) return;

        this.loading = true;

        this.authService.register({
            ...this.form.getRawValue(),
            role: 'OPERATOR',
        }).subscribe({
            next: () => {
                this.loading = false;
                this.snackBar.open('Operador registrado correctamente', 'Cerrar', { duration: 3000 });
                this.form.reset();
            },
            error: () => {
                this.loading = false;
                this.snackBar.open('No se pudo registrar el operador', 'Cerrar', { duration: 3000 });
            },
        });
    }
}