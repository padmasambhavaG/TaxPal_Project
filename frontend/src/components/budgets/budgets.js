import React, { useMemo, useState } from "react";
import "./budgets.css";

const categories = [
  "Office Supplies",
  "Marketing",
  "Utilities",
  "Travel",
  "Payroll",
  "Miscellaneous",
];

function currentMonthISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(iso) {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  const dt = new Date(Number(y), Number(m) - 1, 1);
  return dt.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function parseLabelToISO(label) {
  const parts = String(label).split(" ");
  if (parts.length === 2) {
    const date = new Date(`${parts[0]} 1, ${parts[1]}`);
    if (!isNaN(date)) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }
  }
  return currentMonthISO();
}

// Helper: compute status from spent and budget
function computeStatus(spent, budget) {
  if (budget <= 0) return spent > 0 ? "Bad" : "Good";
  const ratio = spent / budget;
  if (ratio < 0.8) return "Good";
  if (ratio <= 1) return "Warning";
  return "Bad";
}

// Helper: choose overall chip by worst severity
function aggregateStatus(rows) {
  let hasBad = false;
  let hasWarn = false;
  for (const r of rows) {
    const s = computeStatus(r.spent, r.budget);
    if (s === "Bad") hasBad = true;
    else if (s === "Warning") hasWarn = true;
  }
  if (hasBad) return "Bad";
  if (hasWarn) return "Warning";
  return "Good";
}

const seedRows = [
  { id: "1", category: "Office Supplies", budget: 5000, spent: 1200, month: "May 2025", note: "" },
  { id: "2", category: "Marketing", budget: 12000, spent: 11500, month: "May 2025", note: "" },
];

export default function Budgets() {
  const [rows, setRows] = useState(seedRows);

  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: currentMonthISO(),
    note: "",
  });

  const [editId, setEditId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    category: "",
    amount: "",
    month: currentMonthISO(),
    note: "",
  });

  // Derive remaining and computed status for display
  const derived = useMemo(() => {
    return rows.map((r) => {
      const remaining = Math.max(0, r.budget - r.spent);
      const status = computeStatus(r.spent, r.budget);
      return { ...r, remaining, status };
    });
  }, [rows]);

  const topStatus = useMemo(() => aggregateStatus(rows), [rows]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onEditChange = (e) =>
    setEditDraft((d) => ({ ...d, [e.target.name]: e.target.value }));

  const onCancel = () =>
    setForm({ category: "", amount: "", month: currentMonthISO(), note: "" });

  const onCreate = (e) => {
    e.preventDefault();
    if (!form.category.trim() || !form.amount) return;
    const amt = Number(form.amount);
    if (!Number.isFinite(amt) || amt < 0) return;

    const id = Math.random().toString(36).slice(2);
    setRows((r) => [
      ...r,
      {
        id,
        category: form.category.trim(),
        budget: amt,
        spent: 0,
        month: formatMonthLabel(form.month),
        note: form.note.trim(),
      },
    ]);
    onCancel();
  };

  const startEdit = (row) => {
    setEditId(row.id);
    setEditDraft({
      category: row.category,
      amount: String(row.budget),
      month: parseLabelToISO(row.month),
      note: row.note ?? "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const saveEdit = (id) => {
    if (!editDraft.category.trim() || !editDraft.amount) return;
    const amt = Number(editDraft.amount);
    if (!Number.isFinite(amt) || amt < 0) return;

    setRows((r) =>
      r.map((row) =>
        row.id === id
          ? {
              ...row,
              category: editDraft.category.trim(),
              budget: amt,
              month: formatMonthLabel(editDraft.month),
              note: editDraft.note?.trim() ?? "",
            }
          : row
      )
    );
    setEditId(null);
  };

  const deleteRow = (id) => setRows((r) => r.filter((x) => x.id !== id));

  return (
    <div className="budgets-wrap">
      <div className="panel">
        <div className="set-head">
          <div>
            <h2 className="set-titles">Create New Budget</h2>
            <p className="set-sub">Define a monthly amount per category.</p>
          </div>
          <div className="budget-health">
            <span className="muted">Budget Health</span>
            <span className={`chip ${topStatus === "Good" ? "good" : topStatus === "Warning" ? "warn" : "bad"}`}>
              {topStatus}
            </span>
          </div>
        </div>
        <hr />
        <form className="budget-grid" onSubmit={onCreate}>
          <label className="set-field">
            <span className="set-label">Category</span>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="set-field">
            <span className="set-label">Budget Amount</span>
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="₹ 0.00"
              value={form.amount}
              onChange={onChange}
            />
          </label>

          <label className="set-field">
            <span className="set-label">Month</span>
            <input
              type="month"
              name="month"
              value={form.month}
              onChange={onChange}
            />
          </label>

          <label className="set-field span-2">
            <span className="set-label">Description (Optional)</span>
            <textarea
              name="note"
              rows={3}
              placeholder="Add any additional details..."
              value={form.note}
              onChange={onChange}
            />
          </label>

          <div className="toolbar right span-2">
            <button type="button" className="btn ghost sm" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary sm">Create Budget</button>
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="set-head">
          <h3 className="set-title">Budgets</h3>
        </div>

        <div className="table-wrap">
          <table className="budget-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {derived.map((r) => {
                const isEditing = editId === r.id;
                if (!isEditing) {
                  return (
                    <tr key={r.id}>
                      <td>{r.category}</td>
                      <td>₹ {r.budget.toLocaleString()}</td>
                      <td>₹ {r.spent.toLocaleString()}</td>
                      <td>₹ {r.remaining.toLocaleString()}</td>
                      <td>
                        <span className={`chip ${r.status === "Good" ? "good" : r.status === "Warning" ? "warn" : "bad"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="actions-col">
                        <button className="link" onClick={() => startEdit(r)}>Edit</button>
                        {" | "}
                        <button className="link danger" onClick={() => deleteRow(r.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                }

                // Edit row (status removed; it's computed)
                return (
                  <tr key={r.id} className="edit-row">
                    <td>
                      <select
                        name="category"
                        value={editDraft.category}
                        onChange={onEditChange}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        name="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={editDraft.amount}
                        onChange={onEditChange}
                      />
                    </td>
                    <td>₹ {r.spent.toLocaleString()}</td>
                    <td>
                      ₹ {Math.max(0, Number(editDraft.amount || 0) - r.spent).toLocaleString()}
                    </td>
                    <td>
                      <span className={`chip ${computeStatus(r.spent, Number(editDraft.amount || 0)) === "Good" ? "good" : computeStatus(r.spent, Number(editDraft.amount || 0)) === "Warning" ? "warn" : "bad"}`}>
                        {computeStatus(r.spent, Number(editDraft.amount || 0))}
                      </span>
                    </td>
                    <td className="actions-col">
                      <div className="inline-edit-actions">
                        <button type="button" className="btn ghost sm" onClick={cancelEdit}>Cancel</button>
                        <button type="button" className="btn primary sm" onClick={() => saveEdit(r.id)}>Save</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {derived.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">No budgets yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
