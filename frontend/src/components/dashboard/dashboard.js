// src/components/dashboard/Dashboard.js
import React, { useState } from "react";
import "./dashboard.css";

// import modals from separate folders (all .js files)
import IncomeModal from "../income/incomemodal";
import ExpenseModal from "../expence/expencemodal";

export default function Dashboard() {
  // modal visibility state
  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);

  // example handler where records would be persisted
  const handleRecord = (payload) => {
    // TODO: replace with API call or global store action
    console.log("record:", payload);
  };

  return (
    <>
      <header className="dash-header">
        <div className="header-content">
          <h1>Financial Dashboard</h1>
          <p className="welcome-text">
            Welcome back, Alex Morgan! Here's your financial summary.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-record income" onClick={() => setShowIncome(true)}>
            <span className="btn-icon">➕</span>
            Record Income
          </button>
          <button className="btn-record expense" onClick={() => setShowExpense(true)}>
            <span className="btn-icon">➖</span>
            Record Expense
          </button>
        </div>
      </header>

      {/* KPIs */}
      <section className="kpi-section">
        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-label">Monthly Income</div>
            <div className="kpi-value">₹0.00</div>
            <div className="kpi-trend positive">↗ last month</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-label">Monthly Expenses</div>
            <div className="kpi-value">₹0.00</div>
            <div className="kpi-trend neutral">No expenses yet</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-label">Net Income</div>
            <div className="kpi-value">₹0.00</div>
            <div className="kpi-trend positive">↗ Perfect month!</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-label">Savings Rate</div>
            <div className="kpi-value">100.0%</div>
            <div className="kpi-trend positive">↗ Above target</div>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="charts-section">
        <div className="chart-card large">
          <div className="chart-header">
            <h3>Income vs Expenses Overview</h3>
            <div className="chart-filters">
              <button className="filter-btn">Year</button>
              <button className="filter-btn">Quater</button>
              <button className="filter-btn">Month</button>
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="placeholder-content">
              <span className="placeholder-icon"></span>
              <p>Chart visualization</p>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Expense Categories</h3>
          </div>
          <div className="chart-placeholder">
            <div className="placeholder-content">
              <span className="placeholder-icon"></span>
              <p>Pie chart</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transactions */}
      <section className="transactions-section">
        <div className="section-card">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="transactions-placeholder">
            <div className="placeholder-content">
              <span className="placeholder-icon"></span>
              <p>Recent transactions table will appear here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <IncomeModal
        open={showIncome}
        onClose={() => setShowIncome(false)}
        onSubmit={handleRecord}
      />
      <ExpenseModal
        open={showExpense}
        onClose={() => setShowExpense(false)}
        onSubmit={handleRecord}
      />
    </>
  );
}
