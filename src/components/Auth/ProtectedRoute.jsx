import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    const isTokenValid = () => {
        if (!token) {
            return false;
        }

        try 
        {
            // Decode JWT token (base64 decode the payload)
            const parts = token.split('.');
            
            if (parts.length !== 3) 
            {
                return false;
            }

            // Decode the payload (second part)
            const payload = JSON.parse(
                atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
            );

            // Check if token is expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < currentTime) 
            {
                localStorage.removeItem('token');
                return false;
            }

            return true;
        } 
        catch (error) 
        {
            console.error('Error validating token:', error);
            localStorage.removeItem('token');
            return false;
        }
    };

    if (!isTokenValid()) 
    {
        return <Navigate to="/login" replace />;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}