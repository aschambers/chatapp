import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
    const auth = localStorage.getItem('user');
    return auth ? <Outlet /> : <Navigate to="/" />
}
