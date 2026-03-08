import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule],
    template: `
        <mat-toolbar color="primary">
            <span>TransLog</span>
            <span class="spacer"></span>

            <ng-container *ngIf="authService.isAuthenticated()">
                <span class="role">{{ authService.currentUser()?.role }}</span>

                <button mat-button routerLink="/shipments">Envíos</button>

                <button
                mat-button
                *ngIf="authService.isSupervisor()"
                routerLink="/register"
                >
                Registrar operador
                </button>

                <button mat-button (click)="logout()">Salir</button>
            </ng-container>
        </mat-toolbar>
    `,
    styles: [`
        .spacer {
        flex: 1 1 auto;
        }

        .role {
        margin-right: 16px;
        font-size: 14px;
        opacity: 0.9;
        }
    `],
})
export class NavbarComponent {
    readonly authService = inject(AuthService);

    logout(): void {
        this.authService.logout();
    }
}