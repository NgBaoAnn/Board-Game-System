import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAdmin({ children }) {
    const location = useLocation();

    const isAdmin = () => { return true}; // Replace with actual admin check logic
    
    if (!isAdmin()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
