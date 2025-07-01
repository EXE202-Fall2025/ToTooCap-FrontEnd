import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/registerPage";
import AdminPage from "../pages/admin/AdminPage";
import ManagerPage from "../pages/manager/ManagerPage";
import UserPage from "../pages/user/UserPage";
import HomePage from "../pages/user/HomePage";
import DashboardPage from "../pages/user/DashboardPage";
import LoginPage from "../pages/loginPage";
import MyProducts from "../pages/user/MyProducts";
import BrandingGift from "../pages/user/BrandingGift";
import Orders from "../pages/user/Orders"; 
import Premium from "../pages/user/Premium"; 
import ProductDetail from "../pages/user/ProductDetail"; 
import PaymentPage from "../pages/user/PaymentPage";
import ChooseProductPage from "../pages/user/Design/ChooseProductPage";
import ProductDesignDetail from "../pages/user/Design/ProductDesignDetail";
import HatDesignPage from "../pages/user/Design/HatDesignPage";
const MainRoute = () => {
  return (
    <Router>
      <Routes>
        {/* Routes accessible by all users */}
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/my-account" element={<UserPage />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/branding-gift" element={<BrandingGift />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/choose-product" element={<ChooseProductPage />} />
        <Route path="/product-design/:id" element={<ProductDesignDetail />} />
        <Route path="/hat-design" element={<HatDesignPage />} />
        {/* Routes accessible by admin */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Routes accessible by manager */}
        <Route path="/manager" element={<ManagerPage />} />
      </Routes>
    </Router>
  );
};

export default MainRoute;
