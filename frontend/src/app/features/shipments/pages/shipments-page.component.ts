import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../layout/components/navbar.component';

@Component({
    selector: 'app-shipments-page',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    template: `
        <app-navbar></app-navbar>

        <div class="page">
        <h1>Listado de envíos</h1>
        <p>Página en construcción.</p>
        </div>
    `,
    styles: [`
        .page {
        padding: 24px;
        }
    `],
})
export class ShipmentsPageComponent {}