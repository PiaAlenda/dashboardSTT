export type Role = 'ROLE_SUPER_ADMIN' | 'ROLE_ADMIN' | 'ROLE_AUDITOR' | 'ROLE_OBSERVER';

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
    schoolNameOther?: string;
    deleted: boolean;
    updatedAt?: string;
    dataSource?: number | string | null;
    rejectionReasonId?: number;
    rejectionReason?: string;
    rejectionReasonName?: string;
    observation?: string;
    customField1?: string;
    customField2?: string;
    customField3?: string;
    dniTramite?: string;
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
    firstName?: string;
    lastName?: string;
    answeredBy?: string;
    auditorName?: string;
    userName?: string;
}

export interface Statistics {
    byStatus: {
        id: number;
        name: string;
        count: number;
    }[];
    byShift: {
        id: number;
        name: string;
        count: number;
    }[];
    byRoleAndLevel: {
        beneficiaryTypeId: number;
        beneficiaryTypeName: string;
        educationLevelId: number;
        educationLevelName: string;
        count: number;
    }[];
}

export interface ChartDataItem {
    name: string;
    value: number;
    color: string;
}
