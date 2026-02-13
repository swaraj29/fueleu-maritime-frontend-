/**
 * FuelEU Maritime constants as per Regulation (EU) 2023/1805
 */

/** Target GHG intensity for 2025 (gCO₂e/MJ) — 2% below 91.16 */
export const TARGET_INTENSITY = 89.3368;

/** Default reference intensity (gCO₂e/MJ) */
export const REFERENCE_INTENSITY = 91.16;

/** Energy conversion factor: MJ per tonne of fuel */
export const ENERGY_CONVERSION_FACTOR = 41_000;

/** API base URL */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
