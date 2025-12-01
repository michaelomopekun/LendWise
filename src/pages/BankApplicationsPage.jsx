import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BankHeader from '../components/CustomerHeader';
import BankSidebar from '../components/common/BankSidebar';

export default function BankApplicationsPage() 
{
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('applications');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingLoans, setPendingLoans] = useState([]);

    useEffect(() => {
        fetchPendingLoans();
    }, []);

    const fetchPendingLoans = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/bank/login');
                return;
            }

            const response = await fetch('http://localhost:2010/api/banks/loans/pending', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch pending loans');
            }

            console.log('Pending loans fetched successfully:', data);
            setPendingLoans(data.loans || []);

        } catch (err) {
            setError(err.message);
            console.error('Error fetching pending loans:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuChange = (menuId) => {
        setActiveMenu(menuId);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    };

    const handleViewDetails = (loanId, customerId) => {
        navigate(`/bank/loans/${loanId}/${customerId}`);
    };

    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-6 p-4">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex h-screen w-full bg-white font-['Inter','Noto Sans',sans-serif]">
                <BankSidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
                <div className="flex-1 overflow-auto flex flex-col">
                    <BankHeader />
                    <SkeletonLoader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-full bg-white font-['Inter','Noto Sans',sans-serif]">
                <BankSidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
                <div className="flex-1 overflow-auto flex flex-col">
                    <BankHeader />
                    <div className="p-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm font-medium mb-3">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-red-800 underline text-sm hover:text-red-900"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-white font-['Inter','Noto Sans',sans-serif]">
            <BankSidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />

            <div className="flex-1 overflow-auto flex flex-col">
                <BankHeader />

                <main className="flex-1 overflow-auto">
                    {/* Header */}
                    <div className="flex flex-wrap justify-between gap-3 p-4">
                        <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight min-w-72">
                            Pending Loan Requests
                        </p>
                    </div>

                    {/* Applications Table */}
                    <div className="px-4 py-3 @container">
                        <div className="flex overflow-x-auto rounded-lg border border-[#dce1e5] bg-white">
                            <table className="flex-1 min-w-max">
                                <thead>
                                    <tr className="bg-white">
                                        <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                                            Customer Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                                            Amount
                                        </th>
                                        <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                                            Loan Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-[#111518] w-60 text-sm font-medium leading-normal">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingLoans.length > 0 ? (
                                        pendingLoans.map((loan) => (
                                            <tr key={loan.id} className="border-t border-t-[#dce1e5]">
                                                <td className="h-[72px] px-4 py-2 w-[400px] text-[#111518] text-sm font-normal leading-normal">
                                                    {loan.firstName || ''} {loan.lastName || ''}
                                                </td>
                                                <td className="h-[72px] px-4 py-2 w-[400px] text-[#637788] text-sm font-normal leading-normal">
                                                    {formatCurrency(loan.amount)}
                                                </td>
                                                <td className="h-[72px] px-4 py-2 w-[400px] text-[#637788] text-sm font-normal leading-normal">
                                                    {loan.loanTypeName || 'N/A'}
                                                </td>
                                                <td className="h-[72px] px-4 py-2 w-[400px] text-[#637788] text-sm font-normal leading-normal">
                                                    {formatDate(loan.createdAt)}
                                                </td>
                                                <td className="h-[72px] px-4 py-2 w-60 text-sm font-bold leading-normal tracking-[0.015em]">
                                                    <button
                                                        onClick={() => handleViewDetails(loan.id, loan.customerId)}
                                                        className="text-[#1f89e5] hover:text-[#1570c4] transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-t border-t-[#dce1e5]">
                                            <td colSpan="5" className="h-[72px] px-4 py-2 text-center text-[#637788] text-sm font-normal leading-normal">
                                                No pending loan applications found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
