import axios from 'axios';
import { API_BASE_URL } from '../../../shared/constants/fuelConstants';

/**
 * Axios instance configured for the FuelEU Maritime backend API
 */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.error || error.message || 'An unexpected error occurred';
        return Promise.reject(new Error(message));
    },
);

export default apiClient;
