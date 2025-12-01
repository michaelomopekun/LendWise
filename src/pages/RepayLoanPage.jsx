import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerHeader from '../components/CustomerHeader';
import Sidebar from '../components/Common/Sidebar';
import LoanCardSkeleton from '../components/Common/LoanCardSkeleton';
import { toast } from 'sonner';
import { getCustomerIdFromToken } from '../utils/jwtHelper';

export default function RepayLoanPage() {
    const { loanId } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState('repayments');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loanDetails, setLoanDetails] = useState(null);
    const [formData, setFormData] = useState({
        paymentMethod: '',
        paymentAmount: ''
    });

    useEffect(() => {
        fetchLoanDetails();
    }, [loanId]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // useEffect(() => {
    //     if (success) {
    //         toast.success('Payment processed successfully!');
    //     }
    // }, [success]);

    const fetchLoanDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const customerId = getCustomerIdFromToken(token);

            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
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

            setLoanDetails(data.loan || data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching loan details:', err);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.paymentMethod) {
            setError('Please select a payment method');
            return;
        }

        if (!formData.paymentAmount || parseFloat(formData.paymentAmount) <= 0) {
            setError('Please enter a valid payment amount');
            return;
        }

        // Fixed: Use outstandingBalance (capital S) to match API response
        if (parseFloat(formData.paymentAmount) > parseFloat(loanDetails?.outstandingBalance || 0)) {
            setError('Payment amount cannot exceed outstanding balance');
            return;
        }

        try {
            setSubmitting(true);
            const token = localStorage.getItem('token');

            // API expects: { loanId, amount }
            const response = await fetch('http://localhost:2010/api/loans/repay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    loanId: loanId,
                    amount: parseFloat(formData.paymentAmount)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to process payment');
            }

            setSuccess(true);
            setFormData({ paymentMethod: '', paymentAmount: '' });

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/repayment');
            }, 2000);
        } 
        catch (err) 
        {
            setError(err.message);
            console.error('Error processing payment:', err);
        } 
        finally 
        {
            setSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(parseFloat(amount));
    };

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
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 px-4 pt-4">
                        <button 
                            onClick={() => navigate('/repayment')}
                            className="text-[#1f89e5] text-sm hover:underline"
                        >
                            ← Back to Repayment
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-between gap-3 p-4">
                        <p className="text-[#0e151b] tracking-light text-[32px] font-bold leading-tight min-w-72">Loan Repayment</p>
                    </div>

                    {loading ? (
                        <div className="space-y-4 p-4">
                            {[...Array(2)].map((_, index) => (
                                <LoanCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : success ? (
                        <div className="mx-4 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm font-medium">✓ Payment processed successfully! Redirecting...</p>
                        </div>
                    ) : loanDetails ? (
                        <>
                            {/* Loan Details Section */}
                            <h2 className="text-[#0e151b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Loan Details</h2>
                            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                                <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                                    <p className="text-[#4e7597] text-sm font-normal leading-normal">Loan ID</p>
                                    <p className="text-[#0e151b] text-sm font-normal leading-normal">{loanDetails.id?.substring(0, 12) || 'N/A'}</p>
                                </div>
                                <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                                    <p className="text-[#4e7597] text-sm font-normal leading-normal">Loan Type</p>
                                    <p className="text-[#0e151b] text-sm font-normal leading-normal">{loanDetails.loanTypeName || 'N/A'}</p>
                                </div>
                                <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                                    <p className="text-[#4e7597] text-sm font-normal leading-normal">Original Amount</p>
                                    <p className="text-[#0e151b] text-sm font-normal leading-normal">{formatCurrency(loanDetails.amount)}</p>
                                </div>
                                <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                                    <p className="text-[#4e7597] text-sm font-normal leading-normal">Outstanding Balance</p>
                                    <p className="text-[#0e151b] text-sm font-normal leading-normal font-bold text-red-600">{formatCurrency(loanDetails.outstandingBalance)}</p>
                                </div>
                                <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                                    <p className="text-[#4e7597] text-sm font-normal leading-normal">Interest Rate</p>
                                    <p className="text-[#0e151b] text-sm font-normal leading-normal">{loanDetails.interestRate}%</p>
                                </div>
                                <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dce7] py-5">
                                    <p className="text-[#4e7597] text-sm font-normal leading-normal">Tenure</p>
                                    <p className="text-[#0e151b] text-sm font-normal leading-normal">{loanDetails.tenure_month} months</p>
                                </div>
                            </div>

                            {/* Payment Information Section */}
                            <h2 className="text-[#0e151b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Payment Information</h2>
                            <form onSubmit={handleSubmitPayment} className="p-4 space-y-4">
                                <div className="flex max-w-[480px] flex-wrap items-end gap-4">
                                    <label className="flex flex-col min-w-40 flex-1">
                                        <p className="text-[#0e151b] text-base font-medium leading-normal pb-2">Payment Method</p>
                                        <select
                                            name="paymentMethod"
                                            value={formData.paymentMethod}
                                            onChange={handleInputChange}
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e151b] focus:outline-0 focus:ring-0 border border-[#d0dce7] bg-slate-50 focus:border-[#1f89e5] h-14 placeholder:text-[#4e7597] p-[15px] text-base font-normal leading-normal"
                                        >
                                            <option value="">Select Payment Method</option>
                                            <option value="mobile_wallet">Wallet</option>
                                        </select>
                                    </label>
                                </div>

                                <div className="flex max-w-[480px] flex-wrap items-end gap-4">
                                    <label className="flex flex-col min-w-40 flex-1">
                                        <p className="text-[#0e151b] text-base font-medium leading-normal pb-2">Payment Amount</p>
                                        <input
                                            type="number"
                                            name="paymentAmount"
                                            placeholder="Enter Amount"
                                            value={formData.paymentAmount}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            max={parseFloat(loanDetails?.outstandingBalance || 0)}
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e151b] focus:outline-0 focus:ring-0 border border-[#d0dce7] bg-slate-50 focus:border-[#1f89e5] h-14 placeholder:text-[#4e7597] p-[15px] text-base font-normal leading-normal"
                                        />
                                        <p className="text-[#4e7597] text-xs mt-1">Max: {formatCurrency(loanDetails?.outstandingBalance || 0)}</p>
                                    </label>
                                </div>

                                <div className="flex px-4 py-3 justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/repayment')}
                                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#0e151b] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e0e5eb] transition-colors"
                                    >
                                        <span className="truncate">Cancel</span>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1f89e5] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#1a75c4] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        <span className="truncate">{submitting ? 'Processing...' : 'Confirm Payment'}</span>
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : null}
                </main>
            </div>
        </div>
    );
}