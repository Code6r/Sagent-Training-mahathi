import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import MainLayout from "@components/layout/MainLayout";
import Home from "@pages/Home";
import Products from "@pages/Products";
import ProductDetails from "@pages/ProductDetails";
import Cart from "@pages/Cart";
import Checkout from "@pages/Checkout";
import Orders from "@pages/Orders";
import Login from "@pages/Login";
import Register from "@pages/Register";
import Profile from "@pages/Profile";
import NotFound from "@pages/NotFound";
import Admin from "@pages/Admin";
import ProtectedRoute from "@routes/ProtectedRoute";
import { useAuth } from "@hooks/useAuth";

const App = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                {user?.role === "ADMIN" ? <Admin /> : <Navigate to="/" replace />}
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </MainLayout>
  );
};

export default App;

