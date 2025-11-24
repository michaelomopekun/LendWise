import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from '../components/CustomerHeader';
import Sidebar from '../components/Common/Sidebar';
import LoanCardSkeleton from '../components/Common/LoanCardSkeleton';

export default function LoanPage() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState('loans');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loans, setLoans] = useState([]);
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchAllLoans();
    }, []);

    useEffect(() => {
        filterLoans();
    }, [loans, searchTerm, filterStatus]);

    const fetchAllLoans = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:2010/api/loans', {
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

            setLoans(data.loans || data.data || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching loans:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterLoans = () => {
        let filtered = loans;

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(loan => loan.status === filterStatus);
        }

        // Filter by search term
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(loan =>
                loan.id?.toLowerCase().includes(searchLower) ||
                loan.amount?.toString().toLowerCase().includes(searchLower) ||
                loan.loanTypeName?.toLowerCase().includes(searchLower) ||
                loan.dueDate?.toLowerCase().includes(searchLower)
                // loan.amount
            );
        }

        setFilteredLoans(filtered);
    };

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleMenuChange = (menuId) => {
        setActiveMenu(menuId);
    };

    const handleViewLoan = (loanId) => {
        navigate(`/loan/${loanId}`);
    };

    const handleNewLoan = () => {
        navigate('/loan_request');
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

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'paid':
                return 'bg-gray-200 text-gray-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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
                    {/* Header with Title and New Loan Button */}
                    <div className="flex flex-wrap justify-between gap-3 p-4">
                        <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight min-w-72">Loans</p>
                        <button
                            onClick={handleNewLoan}
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f4] text-[#111518] text-sm font-medium leading-normal hover:bg-[#e0e5eb] transition-colors"
                        >
                            <span className="truncate">New Loan</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="px-4 py-3">
                        <label className="flex flex-col min-w-40 h-12 w-full">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                                <div className="text-[#637788] flex border-none bg-[#f0f2f4] items-center justify-center pl-4 rounded-l-lg border-r-0">
                                    <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111518] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#637788] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                                    placeholder="Search loans"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </label>
                    </div>

                    {/* Filter Tabs */}
                    <div className="pb-3">
                        <div className="flex border-b border-[#dce1e5] px-4 gap-8">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                                    filterStatus === 'all'
                                        ? 'border-b-[#111518] text-[#111518]'
                                        : 'border-b-transparent text-[#637788] hover:text-[#111518]'
                                }`}
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">All</p>
                            </button>
                            <button
                                onClick={() => setFilterStatus('active')}
                                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                                    filterStatus === 'active'
                                        ? 'border-b-[#111518] text-[#111518]'
                                        : 'border-b-transparent text-[#637788] hover:text-[#111518]'
                                }`}
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Active</p>
                            </button>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="p-4 grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-6 @container">
                            {[...Array(6)].map((_, index) => (
                                <LoanCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : filteredLoans.length === 0 ? (
                        <div className="p-4 text-center">
                            <p className="text-[#637788] text-sm font-medium">No loans found</p>
                        </div>
                    ) : (
                        <div className="p-4 grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-6 @container">
                            {filteredLoans.map((loan) => (
                                <div
                                    key={loan.id}
                                    className="flex flex-col gap-4 rounded-lg border border-solid border-[#dce1e5] bg-white p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-[#111518]">{loan.id?.substring(0, 8)}</p>
                                        <div className={`flex items-center justify-center rounded-full px-2.5 py-1 ${getStatusColor(loan.status)}`}>
                                            <p className="text-xs font-medium capitalize">{loan.status || 'N/A'}</p>
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm text-[#637788]">Loan Type</p>
                                        <p className="text-base font-medium text-[#111518]">{loan.loanTypeName || 'N/A'}</p>
                                    </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm text-[#637788]">outStanding Balance</p>
                                            <p className="text-base font-medium text-[#111518]">{formatCurrency(loan.outStandingBalance)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm text-[#637788]">Amount</p>
                                            <p className="text-base font-medium text-[#111518]">{formatCurrency(loan.amount)}</p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm text-[#637788]">Due Date</p>
                                            <p className="text-base font-medium text-[#111518]">{formatDate(loan.dueDate || loan.createdAt)}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleViewLoan(loan.id)}
                                        className="flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#f0f2f4] px-4 text-sm font-medium text-[#111518] hover:bg-[#e0e5eb] transition-colors"
                                    >
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}