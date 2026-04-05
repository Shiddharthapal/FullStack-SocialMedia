import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
}

// This is a client-side guard only. It keeps unauthenticated users away from
// protected pages in the UI, but API routes still need their own validation.
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
