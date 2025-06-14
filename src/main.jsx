import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { CategoryProvider } from "./context/CategoryContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./hooks/useCart";
import { AddressProvider } from "./context/AddressContext"; // Added import
import { WishlistProvider } from "./context/WishlistContext";
import { ToastContainer, toast } from "react-toastify";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter >
      <AuthProvider>
        <CartProvider >
          <WishlistProvider>
            <CategoryProvider>
              <AddressProvider>
                <ProductProvider>                 
                  <AppRoutes />                
                </ProductProvider>
              </AddressProvider>
            </CategoryProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    <ToastContainer />
  </StrictMode>
);
