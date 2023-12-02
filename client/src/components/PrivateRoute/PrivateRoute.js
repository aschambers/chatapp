import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const auth = localStorage.getItem('user');
export const PrivateRoute = () => {
    return auth ? <Outlet /> : <Navigate to="/" />
}
