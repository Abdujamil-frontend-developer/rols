import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { routes } from "@/constants/routes";

interface IPublicRoute {
  children: ReactNode;
}

const PublicRoute: FC<IPublicRoute> = ({ children }) => {
  const { isAuthenticated } = useAppStore();

  if (isAuthenticated) {
    return <Navigate to={routes.HOME} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
