import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from '../components/CustomerHeader';
import Sidebar from '../components/Common/Sidebar';

export default function RepaymentPage() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState('repayments');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        fetchActiveLoans();
    }, []);

    const fetchActiveLoans = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:2010/api/loans/active', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch loans');
            }

            setLoans(data.activeLoans || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching loans:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleMenuChange = (menuId) => {
        setActiveMenu(menuId);
    };

    const handleRepay = (loanId) => {
        navigate(`/repay/${loanId}`);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div className="flex h-screen w-full bg-white font-['Inter','Noto Sans',sans-serif]">
            {/* Sidebar */}
            <Sidebar
                activeMenu={activeMenu}
                onMenuChange={handleMenuChange}
                isOpen={sidebarOpen}
                onToggle={handleToggleSidebar}
            />

            {/* Main Content */}
            <div className={`flex-1 overflow-auto flex flex-col`}>
                <CustomerHeader />

                <main className="flex-1 overflow-auto">
                    <div className="flex flex-wrap justify-between gap-3 p-4">
                        <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight min-w-72">Repayment</p>
                    </div>

                    <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Active Loans</h2>

                    {error && (
                        <div className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="p-4 text-center">
                            <p className="text-[#4e7597] text-sm font-medium">Loading loans...</p>
                        </div>
                    ) : loans.length === 0 ? (
                        <div className="p-4 text-center">
                            <p className="text-[#4e7597] text-sm font-medium">No active loans found</p>
                        </div>
                    ) : (
                        <div className="space-y-4 p-4">
                            {loans.map((loan) => (
                                <div
                                    key={loan.id}
                                    className="flex items-stretch justify-between gap-4 rounded-lg bg-white p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)] hover:shadow-[0_0_8px_rgba(0,0,0,0.15)] transition-shadow"
                                >
                                    <div className="flex flex-[2_2_0px] flex-col gap-4">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[#111518] text-base font-bold leading-tight">
                                                Loan ID: {loan.id ?.substring(0, 8)}...
                                            </p>
                                            <p className="text-[#637788] text-sm font-normal leading-normal">
                                                Loan Type: {loan.loanTypeName} | Amount: {formatCurrency(loan.amount)} | Outstanding Balance: {formatCurrency(loan.outStandingBalance)} | Interest Rate: {loan.interestRate}% | Tenure: {loan.tenure_month} months | Status: {loan.status}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRepay(loan.id)}
                                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 flex-row-reverse bg-[#f0f2f4] text-[#111518] text-sm font-medium leading-normal w-fit hover:bg-[#e0e5eb] transition-colors"
                                        >
                                            <span className="truncate">Repay</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}