import React, { useState } from "react";
import "../settings.css";
import "./notifications.css";

export default function Notifications() {
  const [prefs, setPrefs] = useState({
    transactions: true,
    remainder: true,   // if you mean “reminders”, rename both places
    profile: true
  });

  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="panel">
      <div className="set-head">
        <h2 className="set-title">Notifications</h2>
        <p className="set-sub">Choose email and in‑app alerts.</p>
      </div>

      <ul className="list">
        <li className="list-row">
          <span className="sub-notif">Transactions</span>
          <input
            type="checkbox"
            checked={prefs.transactions}
            onChange={() => toggle("transactions")}
          />
        </li>

        <li className="list-row">
          <span className="sub-notif">Payment Reminders</span>
          <input
            type="checkbox"
            checked={prefs.remainder}
            onChange={() => toggle("remainder")}
          />
        </li>        
      </ul>
    </div>
  );
}
