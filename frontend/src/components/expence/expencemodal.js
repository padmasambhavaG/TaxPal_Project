// src/components/expence/expencemodal.js
import React, { useState, useEffect } from "react";
import "./expencemodal.css";

// helpers
const isoToday = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export default function ExpenseModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ description: "", amount: "", category: "", date: "", notes: "" });
  const [errors, setErrors] = useState({ amount: "", description: "", category: "", date: "" });

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]); // [attached_file:1][attached_file:2]

  // set default date on open; reset on close
  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, date: f.date || isoToday() }));
    } else {
      setForm({ description: "", amount: "", category: "", date: "", notes: "" });
      setErrors({ amount: "", description: "", category: "", date: "" });
    }
  }, [open]); // [attached_file:1][attached_file:2]

  if (!open) return null; // [attached_file:1][attached_file:2]

  const handle = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      if (value === "") {
        setForm((f) => ({ ...f, amount: "" }));
        setErrors((er) => ({ ...er, amount: "" }));
        return;
      }
      const num = Number(value);
      if (Number.isNaN(num)) {
        setErrors((er) => ({ ...er, amount: "Enter a valid number" }));
        return;
      }
      if (num < 0) {
        setErrors((er) => ({ ...er, amount: "Amount cannot be negative" }));
        setForm((f) => ({ ...f, amount: "0" }));
        return;
      }
      setErrors((er) => ({ ...er, amount: "" }));
      setForm((f) => ({ ...f, amount: String(Math.max(0, num)) }));
      return;
    }

    if (name === "date") {
      const today = isoToday();
      const next = value && value > today ? today : value; // allow any past date
      setForm((f) => ({ ...f, date: next }));
      setErrors((er) => ({ ...er, date: "" }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  }; // [attached_file:1][attached_file:2]

  const validate = () => {
    const er = {};
    if (!form.description.trim()) er.description = "Description is required";
    const amt = Number(form.amount);
    if (form.amount === "" || Number.isNaN(amt)) er.amount = "Amount is required";
    else if (amt < 0) er.amount = "Amount cannot be negative";
    if (!form.category) er.category = "Select a category";
    if (!form.date) er.date = "Select a date";
    else if (form.date > isoToday()) er.date = "Future date not allowed";
    setErrors((prev) => ({ ...prev, ...er }));
    return Object.keys(er).length === 0;
  }; // [attached_file:1][attached_file:2]

  const save = () => {
    if (!validate()) return;
    onSubmit && onSubmit({ ...form, type: "expense", amount: Number(form.amount) });
    onClose();
  }; // [attached_file:1][attached_file:2]

  return (
    <div className="expense-modal modal-backdrop" role="dialog" aria-modal="true" aria-label="Record New Expense">
      <div className="modal-sheet">
        <div className="modal-header">
          <h3>Record New Expense</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <label>Description</label>
              <input
                name="description"
                placeholder="e.g. Web Design Project"
                value={form.description}
                onChange={handle}
              />
              {errors.description && <small className="field-error">{errors.description}</small>}
            </div>

            <div className="form-row">
              <label>Amount</label>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                value={form.amount}
                onChange={handle}
              />
              {errors.amount && <small className="field-error">{errors.amount}</small>}
            </div>

            <div className="form-row">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handle}>
                <option value="" disabled>Select a category</option>
                <option>Utilities</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Food</option>
                <option>Grossery</option>
                <option>Cloths</option>
              </select>
              {errors.category && <small className="field-error">{errors.category}</small>}
            </div>

            <div className="form-row">
              <label>Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handle}
                max={isoToday()}  // block future dates
              />
              {errors.date && <small className="field-error">{errors.date}</small>}
            </div>

            <div className="form-row full">
              <label>Notes (Optional)</label>
              <textarea
                name="notes"
                rows="4"
                placeholder="Add any additional details..."
                value={form.notes}
                onChange={handle}
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
