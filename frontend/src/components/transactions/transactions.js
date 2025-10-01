import React, { useEffect, useMemo, useState } from "react";
import { txStore } from "./txStore";
import "./transactions.css";

function monthKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key) {
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}
function dateTimeLabel(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${time} · ${date}`;
}

export default function Transactions() {
  const [items, setItems] = useState(txStore.getAll());

  useEffect(() => {
    const unsub = txStore.subscribe(setItems);
    return unsub;
  }, []);

  const grouped = useMemo(() => {
    const by = new Map();
    [...items]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .forEach((t) => {
        const key = monthKey(t.at);
        if (!by.has(key)) by.set(key, []);
        by.get(key).push(t);
      });
    return Array.from(by.entries()).map(([key, rows]) => ({
      key,
      label: monthLabel(key),
      rows,
    }));
  }, [items]);

  return (
    <div className="tx-page">
      <div className="set-head">
        <h2 className="set-title2">Transactions</h2>        
        <p className="set-sub">All income and expenses with date and time.</p>
      </div>
      <p className="set-subs">All Your Transactions</p>  
      <div className="panel">
        {grouped.length === 0 && (
          <div className="empty">No transactions yet.</div>
        )}

        {grouped.map((g) => (
          <section key={g.key} className="tx-section">
            <h3 className="tx-month pointer" title={g.label}>{g.label}</h3>
            <div className="table-wrap">
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Time & Date</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th className="right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map((t) => (
                    <tr key={t.id}>
                      <td className="title">{t.title}</td>
                      <td className="when">{dateTimeLabel(t.at)}</td>
                      <td className="cat">{t.category || "—"}</td>
                      <td className={`type ${t.type}`}>{t.type === "income" ? "Income" : "Expense"}</td>
                      <td className={`amount right ${t.type}`}>
                        {t.type === "income" ? "+" : "-"}₹{Number(t.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
