export interface User {
    id: string;
    email: string;
    role: 'SUPERVISOR' | 'OPERATOR';
}