/**
 * Decode a JWT token to extract the payload
 * @param {string} token - The JWT token to decode
 * @returns {object|null} - The decoded payload or null if decoding fails
 */
export const decodeToken = (token) => {
    try {
        // JWT structure: header.payload.signature
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Extract customer ID from JWT token
 * @param {string} token - The JWT token
 * @returns {string|null} - The customer ID or null if not found
 */
export const getCustomerIdFromToken = (token) => {
    const decoded = decodeToken(token);
    // Try different possible field names for customer ID
    return decoded?.id || decoded?.customerId || decoded?.sub || null;
};
