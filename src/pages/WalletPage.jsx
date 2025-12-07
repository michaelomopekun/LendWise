import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from '../components/CustomerHeader';
import BankSidebar from '../components/Common/BankSidebar';
import Sidebar from '../components/Common/Sidebar';
import { toast } from 'sonner';
import API_ENDPOINTS from '../config/api';

export default function WalletPage() 
{
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState('wallet');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [showAddFundsModal, setShowAddFundsModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [addFundsLoading, setAddFundsLoading] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        description: ''
    });

    useEffect(() => {
        fetchWalletData();
    }, []);

    //decode JWT to get user ID
    const role = (() => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    });

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }

            await Promise.all([
                fetchWallet(token),
                fetchTransactions(token)
            ]);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching wallet data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWallet = async (token) => {
        try {
            const response = await fetch(API_ENDPOINTS.WALLET.GET_DETAILS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch wallet');
            }

            console.log('Wallet data fetched:', data);

            // Handle array response
            const walletData = Array.isArray(data) ? data[0] : data;
            setWallet(walletData);
        } catch (err) {
            console.error('Error fetching wallet:', err);
            throw err;
        }
    };

    const fetchTransactions = async (token) => {
        try {
            const response = await fetch(API_ENDPOINTS.WALLET.GET_TRANSACTIONS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch transactions');
            }

            console.log('Transactions data fetched:', data);

            setTransactions(data.transactions || []);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        }
    };

    const handleAddFunds = async (e) => {
        e.preventDefault();

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            setAddFundsLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch(API_ENDPOINTS.WALLET.ADD_FUNDS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(formData.amount),
                    description: formData.description || 'Wallet funding'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add funds');
            }

            console.log('Funds added:', data);

            toast.success(`Successfully added $${parseFloat(formData.amount).toFixed(2)} to wallet`);
            setShowAddFundsModal(false);
            setFormData({ amount: '', description: '' });
            await fetchWalletData();
        } catch (err) {
            toast.error(err.message || 'Failed to add funds');
            console.error('Error adding funds:', err);
        } finally {
            setAddFundsLoading(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        const walletBalance = parseFloat(wallet?.balance || 0);

        if (parseFloat(formData.amount) > walletBalance) {
            toast.error(`Insufficient balance. Available: $${walletBalance.toFixed(2)}`);
            return;
        }

        try {
            setWithdrawLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch(API_ENDPOINTS.WALLET.WITHDRAW_FUNDS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(formData.amount),
                    description: formData.description || 'Wallet withdrawal'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to withdraw funds');
            }

            console.log('Funds withdrawn:', data);

            toast.success(`Successfully withdrawn $${parseFloat(formData.amount).toFixed(2)} from wallet`);
            setShowWithdrawModal(false);
            setFormData({ amount: '', description: '' });
            await fetchWalletData();
        } catch (err) {
            toast.error(err.message || 'Failed to withdraw funds');
            console.error('Error withdrawing funds:', err);
        } finally {
            setWithdrawLoading(false);
        }
    };

    const handleMenuChange = (menuId) => {
        setActiveMenu(menuId);
    };

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(parseFloat(amount || 0));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    };

    const getTransactionTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'credit':
            case 'fund':
                return 'text-green-600';
            case 'debit':
            case 'withdrawal':
                return 'text-red-600';
            default:
                return 'text-slate-600';
        }
    };

    const getTransactionTypeBadge = (type) => {
        switch (type?.toLowerCase()) {
            case 'credit':
            case 'fund':
                return 'bg-green-100 text-green-800';
            case 'debit':
            case 'withdrawal':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-6 p-8">
            <div className="h-40 bg-slate-200 rounded-lg"></div>
            <div className="h-40 bg-slate-200 rounded-lg"></div>
            <div className="h-64 bg-slate-200 rounded-lg"></div>
        </div>
    );

    const userRole = role();
    const SidebarComponent = userRole === 'bank' ? BankSidebar : Sidebar;

    if (loading) 
    {
        return (
            <div className="flex h-screen w-full bg-slate-50 font-['Inter','Noto Sans',sans-serif]">
            <SidebarComponent
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

    if (error && !wallet) 
    {
        return (
            <div className="flex h-screen w-full bg-slate-50 font-['Inter','Noto Sans',sans-serif]">
                <SidebarComponent
                    activeMenu={activeMenu}
                    onMenuChange={handleMenuChange}
                    isOpen={sidebarOpen}
                    onToggle={handleToggleSidebar}
                />
                <div className={`flex-1 overflow-auto flex flex-col`}>
                    <CustomerHeader />
                    <div className="p-8">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm font-medium mb-3">{error}</p>
                            <button
                                onClick={fetchWalletData}
                                className="text-red-800 underline text-sm hover:text-red-900"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-slate-50 font-['Inter','Noto Sans',sans-serif]">

            <SidebarComponent
                activeMenu={activeMenu}
                onMenuChange={handleMenuChange}
                isOpen={sidebarOpen}
                onToggle={handleToggleSidebar}
            />

            <div className={`flex-1 overflow-auto flex flex-col`}>
                <CustomerHeader />

                <main className="flex-1 overflow-auto">
                    {/* Header */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 p-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold text-slate-900">Wallet</h1>
                            <p className="text-sm text-slate-500">Manage your loan funds and transactions.</p>
                        </div>
                    </div>

                    {/* Wallet Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3 px-8">
                        {/* Main Balance Card */}
                        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium text-slate-600">Loan Fund Balance</h3>
                                <div className="text-slate-400">
                                    <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M216,40H48A24,24,0,0,0,24,64V200a24,24,0,0,0,24,24H216a8,8,0,0,0,0-16H48a8,8,0,0,1-8-8V72H216a8,8,0,0,0,8-8V64A24,24,0,0,0,192,40H176a8,8,0,0,0,0,16h16a8,8,0,0,1,8,8v8H40V64A8,8,0,0,1,48,56H216a8,8,0,0,0,0-16Zm16,48v88a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V96a16,16,0,0,1,16-16h48A16,16,0,0,1,232,96Zm-32,0a16,16,0,1,0,16,16A16,16,0,0,0,200,96Z"></path>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-4xl font-bold tracking-tight text-slate-900">
                                {wallet ? formatCurrency(wallet.balance) : '$0.00'}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <button
                                    onClick={() => setShowAddFundsModal(true)}
                                    className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                                >
                                    Add Funds
                                </button>
                                <button
                                    onClick={() => setShowWithdrawModal(true)}
                                    className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Withdraw Funds
                                </button>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="col-span-1 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 md:col-span-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium text-slate-600">Wallet Information</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-slate-500">Wallet Type</p>
                                    <p className="text-2xl font-semibold text-slate-800 capitalize">
                                        {wallet?.wallet_type?.replace('_', ' ') || 'N/A'}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-slate-500">Status</p>
                                    <p className="text-2xl font-semibold text-green-600 capitalize">
                                        {wallet?.status || 'N/A'}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-slate-500">Wallet ID</p>
                                    <p className="text-sm font-semibold text-slate-800 break-all">
                                        {wallet?.id?.substring(0, 16) || 'N/A'}...
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-slate-500">Created</p>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {wallet?.date_created ? formatDate(wallet.date_created) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="flex flex-col rounded-xl border border-slate-200 bg-white mx-8 mb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-slate-200">
                            <h2 className="text-xl font-semibold text-slate-900">Transaction History</h2>
                            <button
                                onClick={fetchWalletData}
                                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Refresh
                            </button>
                        </div>

                        {transactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                                        <tr>
                                            <th className="px-6 py-3">Transaction ID</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Amount</th>
                                            <th className="px-6 py-3">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction, index) => (
                                            <tr key={transaction.id || index} className="border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                                                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                                                    {transaction.id?.substring(0, 8) || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    {formatDate(transaction.created_at)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getTransactionTypeBadge(transaction.transaction_type)}`}>
                                                        {transaction.transaction_type?.replace('_', ' ').toUpperCase() || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 font-medium ${getTransactionTypeColor(transaction.transaction_type)}`}>
                                                    {transaction.transaction_type?.toLowerCase() === 'debit' ? '-' : '+'}
                                                    {formatCurrency(transaction.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                                                    {transaction.description || transaction.reference || 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-slate-500">No transactions yet</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Add Funds Modal */}
            {showAddFundsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold text-slate-900">Add Funds to Wallet</h2>
                        <form onSubmit={handleAddFunds}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Amount ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="Enter amount"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter description"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddFundsModal(false);
                                        setFormData({ amount: '', description: '' });
                                    }}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addFundsLoading}
                                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {addFundsLoading ? 'Processing...' : 'Add Funds'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Withdraw Funds Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold text-slate-900">Withdraw Funds from Wallet</h2>
                        <form onSubmit={handleWithdraw}>
                            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-600">Available Balance:</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {wallet ? formatCurrency(parseFloat(wallet.balance || 0)) : '$0.00'}
                                </p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Amount ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="Enter amount"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter description"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowWithdrawModal(false);
                                        setFormData({ amount: '', description: '' });
                                    }}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={withdrawLoading}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {withdrawLoading ? 'Processing...' : 'Withdraw'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}