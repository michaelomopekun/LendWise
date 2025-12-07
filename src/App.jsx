import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage';
import BankLoginPage from './pages/BankLoginPage';
import DashboardPage from './pages/DashboardPage';
import BankDashboardPage from './pages/BankDashboardPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoanApplicationPage from './pages/LoanApplicationPage';
import ActiveLoanPage from './pages/ActiveLoanPage';
import RepayLoanPage from './pages/RepayLoanPage';
import LoanPage from './pages/LoanPage';
import LoanDetailsPage from './pages/LoanDetailsPage';
import ProfilePage from './pages/ProfilePage';
import BankRegisterPage from './pages/BankRegisterPage';
import BankApplicationsPage from './pages/BankApplicationsPage';
import BankLoanApplicationDetailPage from './pages/BankLoanApplicationDetailPage';
import WalletPage from './pages/WalletPage';


function App() 
{
    return (
        <>
            <Toaster 
                position="top-right" 
                richColors 
                expand={true}
                closeButton
                duration={8000}
            />

            <Router>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/bank/login" element={<BankLoginPage />} />
                    <Route path="/onboard/bank" element={<BankRegisterPage />} />

                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        } 
                    />

                    <Route 
                        path="/bank/dashboard" 
                        element={
                            <ProtectedRoute>
                                <BankDashboardPage />
                            </ProtectedRoute>
                        } 
                    />

                    <Route 
                        path="/loan/request" 
                        element={
                            <ProtectedRoute>
                                <LoanApplicationPage />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/repayment" 
                        element={
                            <ProtectedRoute>
                                <ActiveLoanPage />
                            </ProtectedRoute>
                        } 
                    />

                    <Route
                        path="/repayment/:loanId"
                        element={
                            <ProtectedRoute>
                                <RepayLoanPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/loans"
                        element={
                            <ProtectedRoute>
                                <LoanPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/loan/:loanId"
                        element={
                            <ProtectedRoute>
                                <LoanDetailsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route 
                        path="/bank/applications"
                        element={
                            <ProtectedRoute>
                                <BankApplicationsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route 
                        path="/bank/loans/:loanId/:customerId"
                        element={
                            <ProtectedRoute>
                                <BankLoanApplicationDetailPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/wallet'
                        element={
                            <ProtectedRoute>
                                <WalletPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
