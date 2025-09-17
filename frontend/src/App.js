import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ForgotPassword from "./components/forgetpassword/forgetpassword";
import SignUp from "./components/signup/signup";
import Signin from "./components/signin/signin";
import ResetPassword from "./components/resetpassword/resetpassword";

import Layout from "./components/layout/layout";
import Dashboard from "./components/dashboard/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
