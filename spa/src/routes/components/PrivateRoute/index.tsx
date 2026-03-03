import { Navigate } from "react-router-dom";
import type { FC, ReactNode } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Layout } from "@/components";
import { routes } from "@/constants/routes";

interface IPrivateRoute {
  children: ReactNode;
  access?: string[];
  role?: string;
}

const PrivateRoute: FC<IPrivateRoute> = ({ children, access = [], role }) => {
  const { isAuthenticated, user } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to={routes.AUTH} replace />;
  }

  // Role check
  if (role && user?.role !== role) {
    return <Navigate to={routes.HOME} replace />;
  }

  // Permission check
  if (access.length > 0) { 
    const hasPermission = user?.role === 'admin' || access.some(p => user?.permissions?.includes(p));
    if (!hasPermission) {
        return <Navigate to={routes.HOME} replace />;
    }
  }

  return <Layout>{children}</Layout>;
};

export default PrivateRoute;
