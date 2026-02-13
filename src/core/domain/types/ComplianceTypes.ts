/**
 * Compliance domain types matching backend API responses
 */

export interface ComplianceBalanceDTO {
    cb: number;
}

export interface AdjustedCBDTO {
    originalCB: number;
    adjustedCB: number;
}
