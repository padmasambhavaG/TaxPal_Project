// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ForgotPassword from "./components/forgetpassword/forgetpassword";
import SignUp from "./components/signup/signup";
import Signin from "./components/signin/signin";
import ResetPassword from "./components/resetpassword/resetpassword";
import Layout from "./components/layout/layout";           // renders Sidebar + <Outlet/>
import Dashboard from "./components/dashboard/dashboard";
import SettingsLayout from "./components/settings/settings"; // uses SettingsNav + <Outlet/>
import Profile from "./components/settings/profile/profile";
import Categories from "./components/settings/categories/categories";
import Notifications from "./components/settings/notifications/notifications";
import Security from "./components/settings/security/security";
import Budgets from "./components/budgets/budgets";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Everything that should show the sidebar lives under Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budgets" element={<Budgets />} />
          {/* Settings also under Layout so Sidebar stays visible */}
          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="categories" element={<Categories />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="security" element={<Security />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
