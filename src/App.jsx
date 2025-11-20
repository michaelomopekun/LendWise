import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage';
function App() {

  return (
    <Router>

      <Routes>
      
        <Route path="/register" element={<RegisterPage />} />
      
        <Route path="/login" element={<LoginPage />} />
      
        <Route path="/" element={<Navigate to="/login" />} />
      
      </Routes>
   
    </Router>
  );
}

export default App
