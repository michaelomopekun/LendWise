import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BankHeader from '../components/CustomerHeader';
import BankSidebar from '../components/common/BankSidebar';

export default function BankLoanApplicationDetailPage() 
{
    const { loanId, customerId } = useParams();
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('applications');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loanDetails, setLoanDetails] = useState(null);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try 
            {
                setLoading(true);
                await Promise.all([
                    fetchLoanDetails(customerId),
                    fetchCustomerDetails(customerId)
                ]);
            } 
            finally 
            {
                setLoading(false);
            }
        };
        
        loadData();
    }, [loanId, customerId]);

    const fetchLoanDetails = async (customerId) => {
        try 
        {
            const token = localStorage.getItem('token');

            if (!token) 
            {
                setError('Authentication token not found. Please log in again.');
                navigate('/bank/login');
                return;
            }

            const response = await fetch(`http://localhost:2010/api/loans/${loanId}/customerId/${customerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch loan details');
            }

            console.log('Loan details fetched successfully:', data);
            setLoanDetails(data.loan || data);

        } 
        catch (err) 
        {
            setError(err.message);
            console.error('Error fetching loan details:', err);
        }
    };

    const fetchCustomerDetails = async (customerId) => {
        try 
        {
            const token = localStorage.getItem('token');

            if (!token) 
            {
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

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch customer details');
            }

            console.log('Customer details fetched successfully:', data);
            setCustomerDetails(data.customer || data);

        } 
        catch (err) 
        {
            console.error('Error fetching customer details:', err);
            // Don't set error here as customer details might not be available for bank view
        }
    };

    const handleApprove = () => {
        toast.warning('Are you sure you want to approve this loan application?', {
            action: {
                label: 'Approve',
                onClick: () => confirmApprove()
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {}
            },
            duration: 5000,
        });
    };

    const confirmApprove = async () => {
        try 
        {
            setActionLoading(true);
            const token = localStorage.getItem('token');

            if (!token)     
            {
                setError('Authentication token not found. Please log in again.');
                return;
            }

            const response = await fetch(`http://localhost:2010/api/banks/loans/${loanId}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to approve loan');
            }

            console.log('Loan approved successfully:', data);
            toast.success('Loan application approved successfully!');
            navigate('/bank/applications');

        } 
        catch (err) 
        {
            setError(err.message);
            console.error('Error approving loan:', err);
            toast.error(`Error: ${err.message}`);
        } 
        finally 
        {
            setActionLoading(false);
        }
    };

    const handleReject = () => {
        toast.warning('Are you sure you want to reject this loan application?', {
            action: {
                label: 'Reject',
                onClick: () => confirmReject()
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {}
            },
            duration: 5000,
        });
    };

    const confirmReject = async () => {
        try 
        {
            setActionLoading(true);
            const token = localStorage.getItem('token');

            if (!token)     
            {
                setError('Authentication token not found. Please log in again.');
                return;
            }

            const response = await fetch(`http://localhost:2010/api/banks/loans/${loanId}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) 
            {
                throw new Error(data.message || 'Failed to reject loan');
            }

            console.log('Loan rejected successfully:', data);
            toast.success('Loan application rejected successfully!');
            navigate('/bank/applications');

        } 
        catch (err) 
        {
            setError(err.message);
            console.error('Error rejecting loan:', err);
            toast.error(`Error: ${err.message}`);
        } 
        finally 
        {
            setActionLoading(false);
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
            month: 'long',
            day: '2-digit'
        });
    };

    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-6 p-4">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-40 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-40 bg-gray-200 rounded-lg"></div>
            </div>
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

    if (error || !loanDetails) {
        return (
            <div className="flex h-screen w-full bg-white font-['Inter','Noto Sans',sans-serif]">
                <BankSidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
                <div className="flex-1 overflow-auto flex flex-col">
                    <BankHeader />
                    <div className="p-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm font-medium mb-3">
                                {error || 'Loan details not found'}
                            </p>
                            <button
                                onClick={() => navigate('/bank/applications')}
                                className="text-red-800 underline text-sm hover:text-red-900"
                            >
                                Back to Applications
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
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => navigate('/bank/applications')}
                                className="text-blue-600 text-sm hover:underline w-fit"
                            >
                                ← Back to Applications
                            </button>
                            <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight min-w-72">
                                Loan Application Details
                            </p>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                        Customer Information
                    </h3>
                    <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Customer ID</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {customerDetails?.id?.substring(0, 16) || 'N/A'}
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Name</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {customerDetails?.firstName || ''} {customerDetails?.lastName || 'N/A'}
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Email</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {customerDetails?.email || 'N/A'}
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Phone</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {customerDetails?.phoneNumber || 'N/A'}
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Occupation</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {customerDetails?.occupation || 'N/A'}
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Income</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {customerDetails?.income ? formatCurrency(customerDetails.income) : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Loan Information */}
                    <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                        Loan Information
                    </h3>
                    <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Loan ID</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {loanDetails.id?.substring(0, 16) || 'N/A'}
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Amount</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {formatCurrency(loanDetails.amount)}
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Interest Rate</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {loanDetails.interestRate}%
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Term</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {loanDetails.tenureMonth} months
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Loan Type</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {loanDetails.loanTypeName || 'N/A'}
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Status</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal capitalize">
                                {loanDetails.status || 'N/A'}
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Application Date</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {formatDate(loanDetails.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons - Only show for pending loans */}
                    {loanDetails.status?.toLowerCase() === 'pending' && (
                        <div className="flex justify-stretch">
                            <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                                <button
                                    onClick={handleApprove}
                                    disabled={actionLoading}
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1f89e5] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#1570c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="truncate">
                                        {actionLoading ? 'Processing...' : 'Approve'}
                                    </span>
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={actionLoading}
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111518] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e5e7e9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="truncate">
                                        {actionLoading ? 'Processing...' : 'Reject'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
