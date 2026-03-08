export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    role: 'SUPERVISOR' | 'OPERATOR';
}

export interface AuthUser {
    id: string;
    email: string;
    role: 'SUPERVISOR' | 'OPERATOR';
}

export interface LoginResponse {
    accessToken: string;
    user: AuthUser;
}
