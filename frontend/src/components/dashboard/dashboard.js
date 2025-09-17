// src/components/dashboard/dashboard.js
import React, { useState } from "react";
import "./dashboard.css";

export default function Dashboard() {
  const [activeTab] = useState('dashboard');

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="brand">TaxPal</div>
        
        <nav className="side-nav">
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button className="nav-btn">
            <span className="nav-icon">💳</span>
            Transaction
          </button>
          <button className="nav-btn">
            <span className="nav-icon">💰</span>
            Budgets
          </button>
          <button className="nav-btn">
            <span className="nav-icon">🧮</span>
            Tax Estimator
          </button>
          <button className="nav-btn">
            <span className="nav-icon">📈</span>
            Reports
          </button>
        </nav>

        <div className="profile-section">
          <div className="profile">
            <div className="avatar">AM</div>
            <div className="profile-info">
              <div className="name">Alex Morgan</div>
              <div className="email">alex.morgan@email.com</div>
            </div>
          </div>
          <div className="profile-actions">
            <button className="link-btn">⚙️ Settings</button>
            <button className="link-btn">🚪 Logout</button>
          </div>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <div className="header-content">
            <h1>Financial Dashboard</h1>
            <p className="welcome-text">Welcome back, Alex Morgan! Here's your financial summary.</p>
          </div>
          <div className="header-actions">
            <button className="btn-record income">
              <span className="btn-icon">➕</span>
              Record Income
            </button>
            <button className="btn-record expense">
              <span className="btn-icon">➖</span>
              Record Expense
            </button>
          </div>
        </header>

        {/* KPI Cards Grid */}
        <section className="kpi-section">
          <div className="kpi-card">
            <div className="kpi-content">
              <div className="kpi-label">Monthly Income</div>
              <div className="kpi-value">₹420.00</div>
              <div className="kpi-trend positive">↗ 12% from last month</div>
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
              <div className="kpi-value">₹420.00</div>
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

        {/* Charts Grid */}
        <section className="charts-section">
          <div className="chart-card large">
            <div className="chart-header">
              <h3>Income vs Expenses Overview</h3>
              <div className="chart-filters">
                <button className="filter-btn active">Year</button>
                <button className="filter-btn">Quater</button>
                <button className="filter-btn">Month</button>
              </div>
            </div>
            <div className="chart-placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">📊</span>
                <p>Chart visualization will go here</p>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Expense Categories</h3>
            </div>
            <div className="chart-placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">🥧</span>
                <p>Pie chart will go here</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="transactions-section">
          <div className="section-card">
            <div className="section-header">
              <h3>Recent Transactions</h3>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="transactions-placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">📋</span>
                <p>Recent transactions table will appear here</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
