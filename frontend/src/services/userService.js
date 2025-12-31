// userService.js

const BASE_URL = 'http://localhost:3000/api';

/**
 * Fetches a list of users with pagination and optional filters.
 * @param {number} page - The page number (default: 1)
 * @param {number} limit - The number of users per page (default: 10)
 * @param {Object} [filters] - Optional filters (e.g., role, status, search)
 * @returns {Promise<Object>} - Returns the full API response object
 */
export const fetchUsers = async (page = 1, limit = 10, filters = {}) => {
    try {
        const params = new URLSearchParams();
        params.set('page', page);
        params.set('limit', limit);
        if (filters.role) params.set('role', filters.role);
        if (filters.status) params.set('status', filters.status);
        if (filters.search) params.set('search', filters.search);

        const response = await fetch(`${BASE_URL}/users?${params.toString()}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, error: error.message };
    }
};