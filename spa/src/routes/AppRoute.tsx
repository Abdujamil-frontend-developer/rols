import React from "react";
import { privateRoutes, publicRoutes } from "./routes";
import NotFound from "@/routes/components/NotFound";
import { Route, Routes, Navigate } from "react-router-dom";
import { routes } from "@/constants/routes";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

const AppRoute = () => {
  return (
    <Routes>
      {publicRoutes.map((el) => (
        <React.Fragment key={el.path}>
          <Route  
            path={el.path}
            element={
              <PublicRoute>
                <el.element />
              </PublicRoute>
            }
          />
        </React.Fragment>
      ))}
      {privateRoutes.map((el) => (
        <React.Fragment key={el.path}>
          <Route
            path={el.path} 
            element={
              <PrivateRoute access={(el as any).access} role={(el as any).role}>  
                <el.element />
              </PrivateRoute>
            }
          />
        </React.Fragment>
      ))} 
      <Route path="/" element={<Navigate to={routes.AUTH} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoute;
