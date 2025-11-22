import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Common/Sidebar';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import UserProfile from '../components/UserProfile';
import LoanActivityTable from '../components/LoanActivityTable';


export default function DashboardPage() 
{
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const [loanSummary, setLoanSummary] = useState({
        totalLoans: 0,
        outstandingBalance: 0,
        nextRepayment: 0
    });

    const [loanActivityData, setLoanActivityData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState({
        name: 'Ethan Harper',
        customerId: '789012',
        joinedDate: '2021-11-20'
    });


    const handleMenuChange = (menuId) => {
        setActiveMenu(menuId);
        console.log('Active menu:', menuId);
    };

    const handleLoansLoaded = (loans) => {
        setLoanActivityData(loans);
    };

    const fetchLoanSummary = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:2010/api/loans/summary', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Could not get loan summary');
            }

            const data = await response.json();
            
            if (data.data) {
                setLoanSummary({
                    totalLoans: data.data.totalLoans || 0,
                    outstandingBalance: data.data.outstandingBalance || 0,
                    nextRepayment: data.data.nextRepayment || 0
                });
            }
        }
        catch(error) {
            setError(error.message);
            console.error("Error fetching loan summary:", error);
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLoanSummary();
    }, [fetchLoanSummary]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };


    return (
        <div className="flex h-screen w-full bg-white font-['Inter','Noto Sans',sans-serif]">
            {/* Sidebar */}
            <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />

            {/* Main Content */}
            <div className="flex-1 overflow-auto flex flex-col">
                <Header AdminView={false} />
                
                <div className="flex-1 overflow-auto">
                    <div className="flex flex-wrap justify-between gap-3 p-4">
                        <div className="flex min-w-72 flex-col gap-3">
                            <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight">Loans Overview</p>
                            <p className="text-[#637788] text-sm font-normal leading-normal">Manage and view your loan information</p>
                        </div>
                    </div>

                    {/* User Profile */}
                    <UserProfile 
                        userName={userProfile.name}
                        customerId={userProfile.customerId}
                        joinedDate={userProfile.joinedDate}
                    />

                    {/* Error Message */}
                    {error && (
                        <div className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm font-medium">{error}</p>
                            <button 
                                onClick={fetchLoanSummary}
                                className="text-red-600 text-sm font-medium mt-2 hover:underline"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Loan Summary Cards */}
                    <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Loan Summary</h2>
                    
                    {loading ? (
                        <div className="flex gap-4 p-4">
                            {[1, 2, 3].map(i => (
                                <Card key={i} className="flex-1 min-w-[158px] animate-pulse">
                                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded"></div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-4 p-4">
                            <Card className="flex-1 min-w-[158px]">
                                <p className="text-[#111518] text-base font-medium leading-normal">Total Loans</p>
                                <p className="text-[#111518] tracking-light text-2xl font-bold leading-tight">{formatCurrency(loanSummary.totalLoans)}</p>
                            </Card>
                            <Card className="flex-1 min-w-[158px]">
                                <p className="text-[#111518] text-base font-medium leading-normal">Outstanding Balance</p>
                                <p className="text-[#111518] tracking-light text-2xl font-bold leading-tight">{formatCurrency(loanSummary.outstandingBalance)}</p>
                            </Card>
                            <Card className="flex-1 min-w-[158px]">
                                <p className="text-[#111518] text-base font-medium leading-normal">Next Repayment</p>
                                <p className="text-[#111518] tracking-light text-2xl font-bold leading-tight">{formatCurrency(loanSummary.nextRepayment)}</p>
                            </Card>
                        </div>
                    )}

                    {/* Apply Button */}
                    <div className="flex px-4 py-3 justify-start">
                        <Button size="lg" onClick={() => navigate('/loan_request')}>Apply for Loan</Button>
                    </div>

                    {/* Recent Loan Activity */}
                    <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recent Loan Activity</h2>
                    <LoanActivityTable loans={loanActivityData} loading={loading} onLoansLoad={handleLoansLoaded} />
                </div>
            </div>
        </div>
    );

};