import React from 'react';
import { isAuthenticated } from '../services/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
    if (!isAuthenticated()) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
