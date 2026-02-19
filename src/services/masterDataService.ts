import api from './api';

export interface RejectionReason {
    id: number;
    name: string;
    active: boolean;
}

export interface BeneficiaryType {
    id: number;
    name: string;
    code: string;
    active: boolean;
}

export const masterDataService = {
    getRejectionReasons: (): Promise<RejectionReason[]> =>
        api.get('public/master-data/rejection-reasons').then(res => res.data),

    getBeneficiaryTypes: (): Promise<BeneficiaryType[]> =>
        api.get('public/master-data/beneficiary-types').then(res => res.data),
};
