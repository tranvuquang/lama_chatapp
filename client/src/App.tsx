import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import PrivatePages from "./pages/PrivatePages";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const PrivateRoute = React.lazy(() => import("./routes/PrivateRoute"));
// console.log(import.meta.env.VITE_BACKEND_URL);
function App() {
  return (
    
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route
            path="/home"
            element={
              <React.Suspense fallback={<h2>...Loading</h2>}>
                <HomePage />
              </React.Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <React.Suspense fallback={<h2>...Loading</h2>}>
                <LoginPage />
              </React.Suspense>
            }
          />
          <Route
            path="*"
            element={
              <React.Suspense fallback={<h2>...Loading</h2>}>
                <PrivateRoute>
                  <PrivatePages />
                </PrivateRoute>
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
