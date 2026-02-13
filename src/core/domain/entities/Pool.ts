import type { PoolMember } from '../types/PoolingTypes';

/**
 * Pool domain entity helpers
 */

/** Get the total CB sum of pool members */
export const getPoolSum = (members: PoolMember[]): number => {
    return members.reduce((sum, m) => sum + m.cbBefore, 0);
};

/** Check if the pool sum is valid (≥ 0) */
export const isPoolValid = (members: PoolMember[]): boolean => {
    return getPoolSum(members) >= 0;
};
