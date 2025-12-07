import API_ENDPOINTS from '../config/api';

/**
 * Generic fetch wrapper for API calls
 * @param {string} endpoint - The endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
}

/**
 * GET request
 */
export async function get(endpoint, options = {}) {
    return apiCall(endpoint, {
        method: 'GET',
        ...options,
    });
}

/**
 * POST request
 */
export async function post(endpoint, body, options = {}) {
    return apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        ...options,
    });
}

/**
 * PUT request
 */
export async function put(endpoint, body, options = {}) {
    return apiCall(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
        ...options,
    });
}

export default {
    get,
    post,
    put,
    apiCall,
};
