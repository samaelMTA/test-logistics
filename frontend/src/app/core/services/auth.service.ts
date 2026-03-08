import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, RegisterRequest, AuthUser } from '../models/auth.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly apiUrl = 'http://localhost:3000';
    private readonly tokenKey = 'translog_token';
    private readonly userKey = 'translog_user';

    private currentUserSignal = signal<AuthUser | null>(this.getStoredUser());

    currentUser = computed(() => this.currentUserSignal());
    isAuthenticated = computed(() => !!this.currentUserSignal());
    isSupervisor = computed(() => this.currentUserSignal()?.role === 'SUPERVISOR');

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
    ) { }

    login(payload: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
            tap((response) => {
                localStorage.setItem(this.tokenKey, response.accessToken);
                localStorage.setItem(this.userKey, JSON.stringify(response.user));
                this.currentUserSignal.set(response.user);
            }),
        );
    }

    register(payload: RegisterRequest) {
        return this.http.post(`${this.apiUrl}/auth/register`, payload);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSignal.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    private getStoredUser(): AuthUser | null {
        const raw = localStorage.getItem(this.userKey);
        return raw ? JSON.parse(raw) : null;
    }
}
