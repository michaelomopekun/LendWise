const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2010';

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    },

    // Customer endpoints
    CUSTOMERS: {
        PROFILE: `${API_BASE_URL}/api/customers/profile`,
        PROFILE_BY_ID: (id) => `${API_BASE_URL}/api/customers/profile/${id}`,
    },

    // Loan endpoints
    LOANS: {
        GET_ALL: `${API_BASE_URL}/api/loans`,
        GET_ACTIVE: `${API_BASE_URL}/api/loans/active`,
        GET_TYPES: `${API_BASE_URL}/api/loans/types`,
        GET_SUMMARY: `${API_BASE_URL}/api/loans/summary`,
        GET_BY_ID: (loanId, customerId) => customerId 
            ? `${API_BASE_URL}/api/loans/${loanId}/customerId/${customerId}`
            : `${API_BASE_URL}/api/loans/${loanId}`,
        REPAY: `${API_BASE_URL}/api/loans/repay`,
        REPAYMENT_HISTORY: (loanId) => `${API_BASE_URL}/api/loans/${loanId}/repayment_history`,
    },

    // Wallet endpoints
    WALLET: {
        GET_DETAILS: `${API_BASE_URL}/api/wallet`,
        GET_TRANSACTIONS: `${API_BASE_URL}/api/wallet/transactions`,
        ADD_FUNDS: `${API_BASE_URL}/api/wallet/fund`,
        WITHDRAW_FUNDS: `${API_BASE_URL}/api/wallet/withdraw`,
    },

    // Bank endpoints
    BANKS: {
        GET_ALL: `${API_BASE_URL}/api/banks`,
        GET_METRICS: `${API_BASE_URL}/api/banks/metrics`,
        GET_PENDING_LOANS: `${API_BASE_URL}/api/banks/loans/pending`,
        APPROVE_LOAN: (loanId) => `${API_BASE_URL}/api/banks/loans/${loanId}/approve`,
        REJECT_LOAN: (loanId) => `${API_BASE_URL}/api/banks/loans/${loanId}/reject`,
        GET_LOAN_DETAILS: (loanId) => `${API_BASE_URL}/api/banks/loans/${loanId}`,
    },
};

export default API_ENDPOINTS;
