import { useState, useEffect } from 'react';

export default function LoanActivityTable({ loans = [], loading = false, onLoansLoad }) 
{
    const [tableLoans, setTableLoans] = useState(loans);
    const [tableLoading, setTableLoading] = useState(loading);
    const [error, setError] = useState(null);

    const getStatusButtonColor = (status) => {
        const normalizedStatus = status?.toLowerCase();
        switch(normalizedStatus) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'active':
                return 'bg-[#f0f2f4] text-[#111518]';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-[#f0f2f4] text-[#111518]';
        }
    };

    const formatLoanStatus = (status) => {
        if (!status) return 'Unknown';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        setTableLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No authentication token found');
                setTableLoading(false);
                return;
            }

            const response = await fetch('http://localhost:2010/api/loans', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok && response.status !== 404) {
                throw new Error('Failed to fetch loans');
            }

            const data = await response.json();
            
            if (data.loans && Array.isArray(data.loans)) {
                const formattedLoans = data.loans
                .slice(0, 5)
                .map(loan => ({
                    id: loan.id,
                    type: loan.loanTypeName || 'Unknown Loan',
                    amount: formatCurrency(loan.amount),
                    status: formatLoanStatus(loan.status),
                    dueDate: formatDate(loan.createdAt),
                    rawStatus: loan.status
                }));

                setTableLoans(formattedLoans);
                onLoansLoad?.(formattedLoans);
            }
        }
        catch(error) {
            setError(error.message);
            console.error("Error fetching loans:", error);
            setTableLoans([]);
        }
        finally {
            setTableLoading(false);
        }
    };

    const SkeletonRow = () => (
        <tr className="border-t border-t-[#dce1e5]">
            <td className="h-[72px] px-4 py-2 w-[400px]">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            </td>
            <td className="h-[72px] px-4 py-2 w-[400px]">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            </td>
            <td className="h-[72px] px-4 py-2 w-[400px]">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </td>
            <td className="h-[72px] px-4 py-2 w-60 flex items-center justify-center">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
            </td>
            <td className="h-[72px] px-4 py-2 w-[400px]">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
            </td>
        </tr>
    );

    if (tableLoading) {
        return (
            <div className="px-4 py-3 @container">
                <div className="flex overflow-hidden rounded-lg border border-[#dce1e5] bg-white">
                    <table className="flex-1">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Loan ID</th>
                                <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Loan Type</th>
                                <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Amount</th>
                                <th className="px-4 py-3 text-left text-[#111518] w-60 text-sm font-medium leading-normal">Status</th>
                                <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Created Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, index) => (
                                <SkeletonRow key={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 py-3 @container">
                <div className="flex overflow-hidden rounded-lg border border-[#dce1e5] bg-white">
                    <div className="w-full p-6">
                        <p className="text-red-600 text-sm font-normal mb-3">{error}</p>
                        <button 
                            onClick={fetchLoans}
                            className="text-blue-600 text-sm font-medium hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!tableLoans || tableLoans.length === 0) {
        return (
            <div className="px-4 py-3 @container">
                <div className="flex overflow-hidden rounded-lg border border-[#dce1e5] bg-white">
                    <div className="w-full p-6 text-center">
                        <p className="text-[#637788] text-sm font-normal">No loans History</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 py-3 @container">
            <div className="flex overflow-x-auto rounded-lg border border-[#dce1e5] bg-white">
                <table className="flex-1 min-w-max">
                    <thead>
                        <tr className="bg-white">
                            <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Loan ID</th>
                            <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Loan Type</th>
                            <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Amount</th>
                            <th className="px-4 py-3 text-left text-[#111518] w-60 text-sm font-medium leading-normal">Status</th>
                            <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableLoans.map((loan, index) => (
                            <tr key={loan.id || index} className="border-t border-t-[#dce1e5]">
                                <td className="h-[72px] px-4 py-2 w-[400px] text-[#111518] text-sm font-normal leading-normal">{loan.id?.substring(0, 8)}...</td>
                                <td className="h-[72px] px-4 py-2 w-[400px] text-[#637788] text-sm font-normal leading-normal">{loan.type}</td>
                                <td className="h-[72px] px-4 py-2 w-[400px] text-[#637788] text-sm font-normal leading-normal">{loan.amount}</td>
                                <td className="h-[72px] px-4 py-2 w-60 flex items-center justify-center">
                                    <button className={`flex min-w-[60px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-sm font-medium leading-normal w-full ${getStatusButtonColor(loan.rawStatus)}`}>
                                        <span className="truncate">{loan.status}</span>
                                    </button>
                                </td>
                                <td className="h-[72px] px-4 py-2 w-[400px] text-[#637788] text-sm font-normal leading-normal">{loan.dueDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}