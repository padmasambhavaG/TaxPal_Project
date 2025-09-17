// src/components/sidebar/sidebar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import {
  FiHome,
  FiCreditCard,
  FiPocket,
  FiPercent,
  FiBarChart2,
  FiSettings,
  FiLogOut
} from "react-icons/fi";

export default function Sidebar({ activeTab = "dashboard" }) {
  const navigate = useNavigate();

  return (
    <aside className="dash-sidebar">
      <div className="brand">TaxPal</div>

      {/* -------- Navigation -------- */}
      <nav className="side-nav">
        <button
          className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          <span className="nav-icon"><FiHome size={18} /></span>
          Dashboard
        </button>

        <button
          className={`nav-btn ${activeTab === "transactions" ? "active" : ""}`}
          onClick={() => navigate("/transactions")}
        >
          <span className="nav-icon"><FiCreditCard size={18} /></span>
          Transactions
        </button>

        <button
          className={`nav-btn ${activeTab === "budgets" ? "active" : ""}`}
          onClick={() => navigate("/budgets")}
        >
          <span className="nav-icon"><FiPocket size={18} /></span>
          Budgets
        </button>

        <button
          className={`nav-btn ${activeTab === "tax" ? "active" : ""}`}
          onClick={() => navigate("/tax")}
        >
          <span className="nav-icon"><FiPercent size={18} /></span>
          Tax Estimator
        </button>

        <button
          className={`nav-btn ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => navigate("/reports")}
        >
          <span className="nav-icon"><FiBarChart2 size={18} /></span>
          Reports
        </button>
      </nav>

      {/* -------- Profile Section -------- */}
      <div className="profile-section">
        <div className="profile-info">
          <div className="avatar">AM</div>
          <div>
            <p className="name">Alex Morgan</p>
            <p className="email">alex.morgan@email.com</p>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="link-btn"
            onClick={() => navigate("/settings")}
          >
            <span className="nav-icon"><FiSettings size={16} /></span>
            Settings
          </button>

          <button
            className="link-btn"
            onClick={() => navigate("/logout")}
          >
            <span className="nav-icon"><FiLogOut size={16} /></span>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
