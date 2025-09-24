import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ForgotPassword from "./components/forgetpassword/forgetpassword";
import SignUp from "./components/signup/signup";
import Signin from "./components/signin/signin";
import ResetPassword from "./components/resetpassword/resetpassword";
import Dashboard from "./components/dashboard/dashboard";
import { ToastProvider } from "./components/toast/ToastProvider";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
