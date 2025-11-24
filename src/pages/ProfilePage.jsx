import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from '../components/CustomerHeader';
import Sidebar from '../components/Common/Sidebar';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerInfo, setCustomerInfo] = useState(null);
    const [loanHistory, setLoanHistory] = useState([]);

    useEffect(() => {
        fetchCustomerProfile();
    }, []);

    const fetchCustomerProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:2010/api/customers/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch customer profile');
            }

            setCustomerInfo(data.customer || data);

            // Fetch loan history
            if (data.customer?.id) {
                fetchLoanHistory(data.customer.id);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching customer profile:', err);
            setLoading(false);
        }
    };

    const fetchLoanHistory = async (customerId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:2010/api/loans?customerId=${customerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setLoanHistory(data.loans || data.data || []);
            }
        } catch (err) {
            console.error('Error fetching loan history:', err);
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
            default:
                return 'bg-[#f0f2f4] text-[#111518]';
        }
    };

    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-6 p-4">
            <div className="h-40 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex h-screen w-full bg-white font-['Inter','Noto Sans',sans-serif]">
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
            <div className="flex h-screen w-full bg-white font-['Inter','Noto Sans',sans-serif]">
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
                                onClick={fetchCustomerProfile}
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

    if (!customerInfo) {
        return (
            <div className="flex h-screen w-full bg-white font-['Inter','Noto Sans',sans-serif]">
                <Sidebar
                    activeMenu={activeMenu}
                    onMenuChange={handleMenuChange}
                    isOpen={sidebarOpen}
                    onToggle={handleToggleSidebar}
                />
                <div className={`flex-1 overflow-auto flex flex-col`}>
                    <CustomerHeader />
                    <div className="p-4 text-center">
                        <p className="text-gray-600 text-sm">No profile data available</p>
                    </div>
                </div>
            </div>
        );
    }

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
                    {/* Header */}
                    <div className="flex flex-wrap justify-between gap-3 p-4">
                        <div className="flex min-w-72 flex-col gap-3">
                            <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight">Customer Details</p>
                            <p className="text-[#637788] text-sm font-normal leading-normal">View and manage customer information</p>
                        </div>
                    </div>

                    {/* Profile Header */}
                    <div className="flex p-4 @container">
                        <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                            <div className="flex gap-4">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                                    style={{
                                        backgroundImage: customerInfo.profileImage 
                                            ? `url("${customerInfo.profileImage}")` 
                                            : `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBXqWEnOvpVtvSpUjrsEdn9LjKhKthyvvWPFhgOZIKk9RnAhgdjI92N9YHaNkRkX-T210-xJdjEauEJ1jXfnNG7bobaomXw3iirHuSFpGHm22Vgjn3dRGq2gq_zqpwJ00SxUW9sA4yn4LW9LPjiIW0ROcr3T_0iXqwa3LQd86r26RxUS4PfTPdS-bU26ZrXmP1PLcbh1aknxZRBtePhbKuIe3Q-yAq2FlZFG8xXaxP7aWCWxcez0kuk9X4wOQULNjm9LUwMgipiRhyn")`
                                    }}
                                ></div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                                        {customerInfo.firstName} {customerInfo.lastName || ''}
                                    </p>
                                    <p className="text-[#637788] text-base font-normal leading-normal">
                                        Customer ID: {customerInfo.id?.substring(0, 8) || 'N/A'}
                                    </p>
                                    <p className="text-[#637788] text-base font-normal leading-normal">
                                        Joined: {formatDate(customerInfo.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information Section */}
                    <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Personal Information</h2>
                    <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Full Name</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">
                                {customerInfo.firstName} {customerInfo.lastName || ''}
                            </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Email</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">{customerInfo.email || 'N/A'}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Phone Number</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">{customerInfo.phoneNumber || 'N/A'}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Address</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">{customerInfo.address || 'N/A'}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">City</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">{customerInfo.city || 'N/A'}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">State/Province</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">{customerInfo.state || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Financial Information Section */}
                    <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Financial Information</h2>
                    <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Credit Score</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">{customerInfo.creditScore || 'N/A'}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Annual Income</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal">{formatCurrency(customerInfo.income || 0)}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce1e5] py-5">
                            <p className="text-[#637788] text-sm font-normal leading-normal">Employment Status</p>
                            <p className="text-[#111518] text-sm font-normal leading-normal capitalize">{customerInfo.occupation || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Loan History Section
                    {loanHistory.length > 0 && (
                        <>
                            <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Loan History</h2>
                            <div className="px-4 py-3 @container">
                                <div className="flex overflow-x-auto rounded-lg border border-[#dce1e5] bg-white">
                                    <table className="flex-1 min-w-max">
                                        <thead>
                                            <tr className="bg-white">
                                                <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Loan ID</th>
                                                <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Loan Type</th>
                                                <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Amount</th>
                                                <th className="px-4 py-3 text-left text-[#111518] w-60 text-sm font-medium leading-normal">Status</th>
                                                <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">Due Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loanHistory.map((loan, index) => (
                                                <tr key={loan.id || index} className="border-t border-t-[#dce1e5] hover:bg-gray-50 cursor-pointer transition-colors"
                                                    onClick={() => navigate(`/loan/${loan.id}`)}
                                                >
                                                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#111518] text-sm font-normal leading-normal">
                                                        {loan.id?.substring(0, 8) || 'N/A'}
                                                    </td>
                                                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#637788] text-sm font-normal leading-normal">
                                                        {loan.loanTypeName || 'N/A'}
                                                    </td>
                                                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#637788] text-sm font-normal leading-normal">
                                                        {formatCurrency(loan.amount)}
                                                    </td>
                                                    <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                                                        <button className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-sm font-medium leading-normal w-full ${getStatusColor(loan.status)}`}>
                                                            <span className="truncate capitalize">{loan.status || 'N/A'}</span>
                                                        </button>
                                                    </td>
                                                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#637788] text-sm font-normal leading-normal">
                                                        {formatDate(loan.dueDate || loan.createdAt)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )} */}

                    {loanHistory.length === 0 && !loading && (
                        <div className="px-4 py-6 text-center">
                            <p className="text-[#637788] text-sm font-normal">No loan history available</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}