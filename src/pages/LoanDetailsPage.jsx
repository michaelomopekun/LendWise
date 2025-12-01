import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerHeader from '../components/CustomerHeader';
import Sidebar from '../components/Common/Sidebar';
import { getCustomerIdFromToken } from '../utils/jwtHelper';

export default function LoanDetailsPage() {
    const { loanId } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState('loans');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loanDetails, setLoanDetails] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [customerInfo, setCustomerInfo] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchLoanDetails(),
                    fetchCustomerDetails(),
                    fetchRepaymentHistory()
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [loanId]);


    const fetchLoanDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const customerId = getCustomerIdFromToken(token);

            console.log('Customer ID from token:', customerId);


            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }

            const loandetailsresponse = await fetch(`http://localhost:2010/api/loans/${loanId}/customerId/${customerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const loandetailsresponsedata = await loandetailsresponse.json();

            if (!loandetailsresponse.ok) {
                throw new Error(loandetailsresponsedata.message || 'Failed to fetch loan details');
            }

            setLoanDetails(loandetailsresponsedata.loan || loandetailsresponsedata);


        } catch (err) {
            setError(err.message);
            console.error('Error fetching loan details:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRepaymentHistory = async () => {
        try 
        {
            const token = localStorage.getItem('token');

            if (!token) 
                {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }

            const repaymenthistoryresponse = await fetch(`http://localhost:2010/api/loans/${loanId}/repayment_history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const repaymenthistorydata = await repaymenthistoryresponse.json();

            if (!repaymenthistoryresponse.ok) 
            {
                throw new Error(repaymenthistorydata.message || 'Failed to fetch loan details');
            }

            setTransactions(repaymenthistorydata.repaymentHistory);

        } 
        catch (err) 
        {
            setError(err.message);
            console.error('Error fetching loan details:', err);
        } 
        finally 
        {
            setLoading(false);
        }


    }

    const fetchCustomerDetails = async () => {
        try 
        {
            const token = localStorage.getItem('token');

            const customerId = getCustomerIdFromToken(token);

            console.log('Customer ID from token:', customerId);


            if (!token) 
            {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:2010/api/customers/profile/${customerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) 
            {
                throw new Error(data.message || 'Failed to fetch loan details');
            }

            setCustomerInfo(data.customer || data);

        } 
        catch (err) 
        {
            setError(err.message);
            console.error('Error fetching customer details:', err);
        } 
        finally 
        {
            setLoading(false);
        }
    };

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
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
            month: 'long',
            day: '2-digit'
        });
    };

    const getRepaymentProgress = () => {
        if (!loanDetails) return 0;
        const principal = parseFloat(loanDetails.amount || 0);
        const interest = parseFloat((loanDetails.interestRate/100)*loanDetails.amount);
        const outstanding = parseFloat(loanDetails.outstandingBalance || 0);
        if (principal === 0) return 0;
        return Math.round((((principal + interest) - outstanding) / (principal + interest)) * 100);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-6 p-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex h-screen w-full bg-slate-50 font-['Inter','Noto Sans',sans-serif]">
                <Sidebar
                    activeMenu={activeMenu}
                    onMenuChange={handleMenuChange}
                    isOpen={sidebarOpen}
                    onToggle={handleToggleSidebar}
                />
                <div className={`flex-1 overflow-auto flex flex-col`}>
                    <CustomerHeader />
                    <SkeletonLoader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-full bg-slate-50 font-['Inter','Noto Sans',sans-serif]">
                <Sidebar
                    activeMenu={activeMenu}
                    onMenuChange={handleMenuChange}
                    isOpen={sidebarOpen}
                    onToggle={handleToggleSidebar}
                />
                <div className={`flex-1 overflow-auto flex flex-col`}>
                    <CustomerHeader />
                    <div className="p-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm font-medium mb-3">{error}</p>
                            <button
                                onClick={() => navigate('/loans')}
                                className="text-red-800 underline text-sm hover:text-red-900"
                            >
                                Go Back to Loans
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!loanDetails) {
        return (
            <div className="flex h-screen w-full bg-slate-50 font-['Inter','Noto Sans',sans-serif]">
                <Sidebar
                    activeMenu={activeMenu}
                    onMenuChange={handleMenuChange}
                    isOpen={sidebarOpen}
                    onToggle={handleToggleSidebar}
                />
                <div className={`flex-1 overflow-auto flex flex-col`}>
                    <CustomerHeader />
                    <div className="p-4 text-center">
                        <p className="text-gray-600 text-sm">No loan data available</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-slate-50 font-['Inter','Noto Sans',sans-serif]">
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
                    {/* Header */}
                    <div className="flex flex-wrap justify-between gap-3 p-4">
                        <div className="flex min-w-72 flex-col gap-3">
                            <button
                                onClick={() => navigate('/loans')}
                                className="text-blue-600 text-sm hover:underline w-fit"
                            >
                                ← Back to Loans
                            </button>
                            <p className="text-[#0e151b] tracking-light text-[32px] font-bold leading-tight">Customer Loan Overview</p>
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">View detailed information about this customer's loan.</p>
                        </div>
                    </div>

                    {/* Loan Details Section */}
                    <h2 className="text-[#0e151b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Loan Details</h2>
                    <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">Loan ID</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal">{loanDetails.id?.substring(0, 16) || 'N/A'}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">Loan Type</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal">{loanDetails.loanTypeName || 'N/A'}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">Loan Amount</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal">{formatCurrency(loanDetails.amount)}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">Interest Rate</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal">{loanDetails.interestRate}%</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">Tenure</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal">{loanDetails.tenure_month} months</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">Status</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal capitalize">{loanDetails.status || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Customer Information Section */}
                    <h2 className="text-[#0e151b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Customer Information</h2>
                    <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">Customer Name</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal">{customerInfo?.lastName && customerInfo?.firstName ? `${customerInfo.lastName} ${customerInfo.firstName}` : 'N/A'}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">Customer Email</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal">{customerInfo?.email || 'N/A'}</p>
                        </div>
                        {/* <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">Created Date</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal">{formatDate(loanDetails.createdAt)}</p>
                        </div> */}
                    </div>

                    {/* Loan Status Section */}
                    <h2 className="text-[#0e151b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Loan Status</h2>
                    <div className="flex flex-col gap-3 p-4">
                        <div className="flex gap-6 justify-between">
                            <p className="text-[#0e151b] text-base font-medium leading-normal">Loan Repayment Progress</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal">{getRepaymentProgress()}%</p>
                        </div>
                        <div className="rounded bg-[#d0dce7]">
                            <div 
                                className="h-2 rounded bg-[#1f89e5] transition-all"
                                style={{ width: `${getRepaymentProgress()}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">Outstanding Balance</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal font-bold text-red-600">{formatCurrency(loanDetails.outstandingBalance)}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                            <p className="text-[#4e7597] text-sm font-normal leading-normal">Amount Paid</p>
                            <p className="text-[#0e151b] text-sm font-normal leading-normal">{formatCurrency((parseFloat((loanDetails.interestRate/100)*loanDetails.amount)) + parseFloat(loanDetails.amount) - parseFloat(loanDetails.outstandingBalance))}</p>
                        </div>
                    </div>

                    {/* Recent Transactions Section */}
                    {transactions.length > 0 && (
                        <>
                            <h2 className="text-[#0e151b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recent Transactions</h2>
                            <div className="px-4 py-3 @container">
                                <div className="flex overflow-x-auto rounded-lg border border-[#d0dce7] bg-white">
                                    <table className="flex-1 min-w-max">
                                        <thead>
                                            <tr className="bg-white">
                                                <th className="px-4 py-3 text-left text-[#0e151b] w-[400px] text-sm font-medium leading-normal">Date</th>
                                                <th className="px-4 py-3 text-left text-[#0e151b] w-[400px] text-sm font-medium leading-normal">Type</th>
                                                <th className="px-4 py-3 text-left text-[#0e151b] w-[400px] text-sm font-medium leading-normal">Amount</th>
                                                <th className="px-4 py-3 text-left text-[#0e151b] w-60 text-sm font-medium leading-normal">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.slice(0, 10).map((transaction, index) => (
                                                <tr key={transaction.id || index} className="border-t border-t-[#d0dce7]">
                                                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#4e7597] text-sm font-normal leading-normal">
                                                        {formatDate(transaction.paymentDate || transaction.createdAt)}
                                                    </td>
                                                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#4e7597] text-sm font-normal leading-normal">
                                                        {transaction.type || 'Wallet'}
                                                    </td>
                                                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#4e7597] text-sm font-normal leading-normal">
                                                        {formatCurrency(transaction.amountPaid)}
                                                    </td>
                                                    <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                                                        <button className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-sm font-medium leading-normal w-full ${getStatusColor(transaction.status)}`}>
                                                            <span className="truncate capitalize">{transaction.status || 'Pending'}</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}