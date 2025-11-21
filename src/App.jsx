import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import OfficerDashboardPage from './pages/OfficerDashboardPage';


function App() {

  return (
    <Router>

      <Routes>
      
        <Route path="/register" element={<RegisterPage />} />
      
        <Route path="/login" element={<LoginPage />} />

        <Route path="/Admin" element={<AdminLoginPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/loan_officer_dashboard" element={<OfficerDashboardPage />} />
      
        <Route path="/" element={<Navigate to="/login" />} />
      
      </Routes>
   
    </Router>
  );
}

export default App
