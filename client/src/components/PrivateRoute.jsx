import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
    // Accessing the currentUser state from Redux store
    const { currentUser } = useSelector((state) => state.user);

    // Returning the Outlet component if currentUser exists, otherwise navigate to '/sign-in'
    return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}
