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
    selector: 'app-login-page',
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
            <h1>TransLog</h1>
            <p>Inicia sesión para gestionar envíos</p>

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
                    {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
                </button>
            </form>

            <div class="hint">
            <p>Solo los supervisores pueden registrar nuevos usuarios.</p>
            </div>
            <div class="actions">
                <a routerLink="/tracking">
                    <button mat-button type="button" class="full-width">Consultar tracking público</button>
                </a>
            </div>
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

        h1 {
            margin-bottom: 8px;
        }

        .hint {
            margin-top: 16px;
            color: #666;
            font-size: 14px;
        }
        .actions {
            margin-top: 8px;
        }
    `],
})
export class LoginPageComponent {
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

        this.authService.login(this.form.getRawValue()).subscribe({
            next: (response) => {
                this.loading = false;
                this.snackBar.open(`Bienvenido ${response.user.role}`, 'Cerrar', { duration: 3000 });

                if (response.user.role === 'SUPERVISOR') {
                    this.router.navigate(['/register']);
                    return;
                }

                this.router.navigate(['/shipments']);
            },
            error: () => {
                this.loading = false;
                this.snackBar.open('Credenciales inválidas', 'Cerrar', { duration: 3000 });
            },
        });
    }
}