import AppRoute from "./routes/AppRoute"
import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";

function App() {
  const { checkAuth } = useAppStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="container">
      <AppRoute />
    </div>
  )
}

export default App
