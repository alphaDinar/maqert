import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './Styles/index.css'
import { BrowserRouter } from 'react-router-dom'
import { createContext, useContext, useState } from 'react';

const LoaderContext = createContext();
export const LoaderProvider = ({ children }) => {
  const [loader, setLoader] = useState(true);
  return (
    <LoaderContext.Provider value={{ loader, setLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
export const useLoader = () => {
  return useContext(LoaderContext);
};

const ManagerSidebarContext = createContext();
export const ManagerSidebarProvider = ({ children }) => {
  const [managerSidebar, setManagerSidebar] = useState(false);
  return (
    <ManagerSidebarContext.Provider value={{ managerSidebar, setManagerSidebar }}>
      {children}
    </ManagerSidebarContext.Provider>
  );
};
export const useManagerSidebar = () => {
  return useContext(ManagerSidebarContext);
};

const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  return useContext(CartContext);
};

const CartInfoContext = createContext();
export const CartInfoProvider = ({ children }) => {
  const [cartInfo, setCartInfo] = useState({ itemCount: 0, total: 0 });
  return (
    <CartInfoContext.Provider value={{ cartInfo, setCartInfo }}>
      {children}
    </CartInfoContext.Provider>
  );
};
export const useCartInfo = () => {
  return useContext(CartInfoContext);
};

const CartTriggerContext = createContext();
export const CartTriggerProvider = ({ children }) => {
  const [cartTrigger, setCartTrigger] = useState(0);
  return (
    <CartTriggerContext.Provider value={{ cartTrigger, setCartTrigger }}>
      {children}
    </CartTriggerContext.Provider>
  );
};
export const useCartTrigger = () => {
  return useContext(CartTriggerContext);
};

const WishListContext = createContext();
export const WishListProvider = ({ children }) => {
  const [wishList, setWishList] = useState([]);
  return (
    <WishListContext.Provider value={{ wishList, setWishList }}>
      {children}
    </WishListContext.Provider>
  );
};
export const useWishList = () => {
  return useContext(WishListContext);
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <LoaderProvider>
        <ManagerSidebarProvider>
          <CartProvider>
            <CartInfoProvider>
              <CartTriggerProvider>
                <WishListProvider>
                  <App />
                </WishListProvider>
              </CartTriggerProvider>
            </CartInfoProvider>
          </CartProvider>
        </ManagerSidebarProvider>
      </LoaderProvider>
    </React.StrictMode>
  </BrowserRouter>
)
