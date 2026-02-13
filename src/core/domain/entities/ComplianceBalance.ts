/**
 * ComplianceBalance domain entity helpers
 */

/** Whether the CB value represents surplus (compliant) */
export const isSurplus = (cb: number): boolean => cb > 0;

/** Whether the CB value represents deficit (non-compliant) */
export const isDeficit = (cb: number): boolean => cb < 0;
