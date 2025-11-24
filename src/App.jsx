import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import OfficerDashboardPage from './pages/OfficerDashboardPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoanApplicationPage from './pages/LoanApplicationPage';
import ActiveLoanPage from './pages/ActiveLoanPage';
import RepayLoanPage from './pages/RepayLoanPage';
import LoanPage from './pages/LoanPage';
import LoanDetailsPage from './pages/LoanDetailsPage';
import ProfilePage from './pages/ProfilePage';


function App() 
{
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/Admin" element={<AdminLoginPage />} />

                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/loan_officer_dashboard" 
                    element={
                        <ProtectedRoute>
                            <OfficerDashboardPage />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/loan_request" 
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

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
