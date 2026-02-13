/**
 * Pooling domain types matching backend API responses
 */

export interface PoolMember {
    shipId: string;
    cbBefore: number;
    cbAfter?: number;
    year?: number;
}

export interface CreatePoolRequest {
    members: PoolMember[];
    year: number;
}

export interface PoolMemberResult {
    shipId: string;
    cbBefore: number;
    cbAfter: number;
    year: number;
}
