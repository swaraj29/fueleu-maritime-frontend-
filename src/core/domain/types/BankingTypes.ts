/**
 * Banking domain types matching backend API responses
 */

export interface BankRecordDTO {
    shipId: string;
    year: number;
    totalBanked: number;
}

export interface BankSurplusRequest {
    shipId: string;
    year: number;
}

export interface BankSurplusResponse {
    bankedAmount: number;
}

export interface ApplyBankedRequest {
    shipId: string;
    year: number;
    amount: number;
}

export interface ApplyBankedResponse {
    cb_before: number;
    applied: number;
    cb_after: number;
}
