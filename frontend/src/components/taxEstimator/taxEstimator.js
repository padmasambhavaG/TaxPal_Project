import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddReminderModal from "../taxCalender/addReminderModal";
import "./taxEstimator.css";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
  "Japan",
];

// Minimal demo lists per country; extend as needed
const STATES_BY_COUNTRY = {
  "United States": ["California", "New York", "Texas", "Florida"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia"],
  Germany: ["Bavaria", "Berlin", "Hesse", "North Rhine-Westphalia"],
  France: ["Île-de-France", "Provence-Alpes-Côte d’Azur", "Nouvelle-Aquitaine", "Occitanie"],
  India: ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi"],
  Japan: ["Tokyo", "Osaka", "Hokkaido", "Aichi"],
};

const QUARTERS = [
  { id: "Q1", label: "Q1 (Jan–Mar)" },
  { id: "Q2", label: "Q2 (Apr–Jun)" },
  { id: "Q3", label: "Q3 (Jul–Sep)" },
  { id: "Q4", label: "Q4 (Oct–Dec)" },
];

const FILING_STATUS = [
  "Single",
  "Married Filing Jointly",
  "Married Filing Separately",
  "Head of Household",
];

function estimateQuarterlyTax({
  country,
  state,
  status,
  income,
  expenses,
  insurance,
  retirement,
  homeOffice,
}) {
  const gross = Number(income || 0);
  const ded =
    Number(expenses || 0) +
    Number(insurance || 0) +
    Number(retirement || 0) +
    Number(homeOffice || 0);

  const statusStd =
    {
      Single: 13000,
      "Married Filing Jointly": 26000,
      "Married Filing Separately": 13000,
      "Head of Household": 19000,
    }[status] ?? 13000;

  const rateByCountry = {
    "United States": 0.22,
    India: 0.20,
    "United Kingdom": 0.21,
    Canada: 0.23,
    Australia: 0.22,
    Germany: 0.24,
    France: 0.23,
    Japan: 0.22,
  };
  const baseRate = rateByCountry[country] ?? 0.20;

  let stateAdj = 0;
  if (country === "United States") {
    if (state === "California") stateAdj = 0.02;
    if (state === "New York") stateAdj = 0.015;
  }

  const effectiveRate = Math.max(0, baseRate + stateAdj);

  const quarterlyGross = gross;
  const quarterlyDeductions = Math.max(0, ded);
  const quarterlyTaxable = Math.max(0, quarterlyGross - quarterlyDeductions);
  const annualTaxable = Math.max(0, quarterlyTaxable * 4 - statusStd);
  const annualTax = Math.max(0, annualTaxable * effectiveRate);
  const estimatedQuarterlyTax = Math.round(annualTax / 4);

  return {
    grossQuarter: quarterlyGross,
    deductionsQuarter: quarterlyDeductions,
    taxableQuarter: quarterlyTaxable,
    annualTaxable,
    annualTax,
    estimatedQuarterlyTax,
    effectiveRate,
  };
}

export default function TaxEstimator() {
  const navigate = useNavigate();
  const [openReminder, setOpenReminder] = useState(false);

  const [form, setForm] = useState({
    country: "United States",
    state: "California",
    status: "Single",
    quarter: "Q2",
    income: "",
    expenses: "",
    insurance: "",
    retirement: "",
    homeOffice: "",
  });

  const subdivisions = useMemo(() => STATES_BY_COUNTRY[form.country] ?? [], [form.country]);
  const hasSubdivisions = subdivisions.length > 0;

  // Reset state when country changes if current state is invalid
  useEffect(() => {
    setForm((f) => {
      if (!hasSubdivisions) {
        return { ...f, state: "" };
      }
      if (!subdivisions.includes(f.state)) {
        return { ...f, state: subdivisions[0] };
      }
      return f;
    });
  }, [form.country, hasSubdivisions, subdivisions]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const result = useMemo(() => estimateQuarterlyTax(form), [form]);

  const quarterDueDate = useMemo(() => {
    // simple demo due dates
    const year = new Date().getFullYear();
    const map = {
      Q1: `${year}-04-15`,
      Q2: `${year}-06-15`,
      Q3: `${year}-09-15`,
      Q4: `${year + 1}-01-15`,
    };
    return map[form.quarter] || "";
  }, [form.quarter]);

  const seedReminder = useMemo(
    () => ({
      title: `${form.quarter} Estimated Tax Payment`,
      date: quarterDueDate,
      type: "payment",
    }),
    [form.quarter, quarterDueDate]
  );

  return (
    <div className="tax-page">
      <div className="set-head between">
        <div>
          <h2 className="set-title">Tax Estimator</h2>
          <p className="set-sub">Calculate estimated quarterly tax obligations.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-outlines" onClick={() => navigate("/tax-calendar")}>
            Tax Calendar
          </button>
          <button className="btn primary" onClick={() => setOpenReminder(true)}>
            Add Reminder
          </button>
        </div>
      </div>

      <div className="tax-layout">
        <div className="panel left">
          <form className="tax-grid" onSubmit={(e) => e.preventDefault()}>
            <label className="set-field">
              <span className="set-label">Country/Region</span>
              <select name="country" value={form.country} onChange={onChange}>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="set-field">
              <span className="set-label">State/Province</span>
              <select
                name="state"
                value={form.state}
                onChange={onChange}
                disabled={!hasSubdivisions}
                title={!hasSubdivisions ? "No subdivisions for this country" : undefined}
              >
                {hasSubdivisions ? (
                  subdivisions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))
                ) : (
                  <option value="">N/A</option>
                )}
              </select>
            </label>

            <label className="set-field">
              <span className="set-label">Filing Status</span>
              <select name="status" value={form.status} onChange={onChange}>
                {FILING_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="set-field">
              <span className="set-label">Quarter</span>
              <select name="quarter" value={form.quarter} onChange={onChange}>
                {QUARTERS.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="set-field span-2">
              <span className="set-label">Gross Income for Quarter</span>
              <input
                name="income"
                type="number"
                min="0"
                step="0.01"
                placeholder="₹ 0.00"
                value={form.income}
                onChange={onChange}
              />
            </label>

            <div className="grid-2 span-2">
              <label className="set-field">
                <span className="set-label">Business Expenses</span>
                <input
                  name="expenses"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="₹ 0.00"
                  value={form.expenses}
                  onChange={onChange}
                />
              </label>
              <label className="set-field">
                <span className="set-label">Health Insurance Premiums</span>
                <input
                  name="insurance"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="₹ 0.00"
                  value={form.insurance}
                  onChange={onChange}
                />
              </label>
            </div>

            <div className="grid-2 span-2">
              <label className="set-field">
                <span className="set-label">Retirement Contributions</span>
                <input
                  name="retirement"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="₹ 0.00"
                  value={form.retirement}
                  onChange={onChange}
                />
              </label>
              <label className="set-field">
                <span className="set-label">Home Office Deduction</span>
                <input
                  name="homeOffice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="₹ 0.00"
                  value={form.homeOffice}
                  onChange={onChange}
                />
              </label>
            </div>

            <div className="toolbar">
              <button
                type="button"
                className="btn primary"
                onClick={() => setForm((f) => ({ ...f }))}
              >
                Calculate Estimated Tax
              </button>
            </div>
          </form>
        </div>

        <div className="panel right">
          <h4 className="set-title sm">Tax Summary</h4>
          <div className="summary">
            <div className="row">
              <span>Quarterly Gross</span>
              <span>₹{result.grossQuarter.toLocaleString()}</span>
            </div>
            <div className="row">
              <span>Quarterly Deductions</span>
              <span>₹{result.deductionsQuarter.toLocaleString()}</span>
            </div>
            <div className="row">
              <span>Quarterly Taxable</span>
              <span>₹{result.taxableQuarter.toLocaleString()}</span>
            </div>
            <div className="row">
              <span>Annual Taxable (est.)</span>
              <span>₹{result.annualTaxable.toLocaleString()}</span>
            </div>
            <div className="row">
              <span>Effective Rate</span>
              <span>{(result.effectiveRate * 100).toFixed(1)}%</span>
            </div>
            <hr />
            <div className="row total">
              <span>Estimated Quarterly Tax</span>
              <span>₹{result.estimatedQuarterlyTax.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <AddReminderModal
        open={openReminder}
        onClose={() => setOpenReminder(false)}
        seed={seedReminder}
      />
    </div>
  );
}