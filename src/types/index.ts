export type Role = 'ROLE_SUPER_ADMIN' | 'ROLE_ADMIN' | 'ROLE_AUDITOR';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    username: string;
    role: Role;
    deleted: boolean;
    createdBy?: string;
    createdAt?: string;
}

export interface UserHistory {
    id: number;
    userId: number;
    action: string;
    details: string;
    changedBy: string;
    changedAt: string;
}

export interface Enrollment {
    id: number;
    dni: string;
    firstName: string;
    lastName: string;
    email: string;
    cuil: string;
    status: string;
    createdAt: string;
    beneficiaryType: string;
    educationLevel: string;
    schoolName: string;
    deleted: boolean;
    updatedAt?: string;
    dataSource?: string | null;
    rejectionReasonId?: number;
    rejectionReasonName?: string;
    observation?: string;
    customField1?: string;
    customField2?: string;
    customField3?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export type ClaimStatus = 'PENDIENTE' | 'RESPONDIDO' | 'CERRADO' | 'CONTESTADO';

export interface Claim {
    id: number;
    dni: string;
    email: string;
    phone: string;
    cause: string;
    description?: string;
    comment: string;
    trackingCode: string;
    status: ClaimStatus;
    answer?: string;
    replyMessage?: string;
    createdAt: string;
    answeredAt?: string;
}
