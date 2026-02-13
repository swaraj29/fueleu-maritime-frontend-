/**
 * Utility formatting functions for the FuelEU Maritime dashboard
 */

/** Format a number with commas and optional decimal places */
export const formatNumber = (value: number, decimals = 2): string => {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

/** Format GHG intensity value with unit */
export const formatGHGIntensity = (value: number): string => {
    return `${value.toFixed(4)} gCO₂e/MJ`;
};

/** Format CB value in tonnes CO₂eq */
export const formatCB = (value: number): string => {
    const abs = Math.abs(value);
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${formatNumber(abs, 0)} gCO₂eq`;
};

/** Format percentage difference */
export const formatPercentDiff = (value: number): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
};

/** Determine if a value represents a surplus */
export const isSurplus = (cb: number): boolean => cb > 0;

/** Determine if a value represents a deficit */
export const isDeficit = (cb: number): boolean => cb < 0;
