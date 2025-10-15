import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (token && user && user.role === 'admin') {
        return <Outlet />;
    }
    return <Navigate to="/login" />;
}

export default AdminRoute;