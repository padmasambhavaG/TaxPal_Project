// src/components/modals/ConfirmLogout.js
import React from "react";
import "./confirmlogout.css";

export default function ConfirmLogout({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="confirm-backdrop" role="dialog" aria-modal="true" aria-label="Confirm logout">
      <div className="confirm-sheet">
        <div className="confirm-header">
          <h3>Confirm Logout</h3>
          <button className="icon-btn" onClick={onCancel} aria-label="Close">✕</button>
        </div>

        <div className="confirm-body">
          <img
            src="/illustration.png"
            alt="Logout illustration"
            className="confirm-illustration"
          />
          <p>Are you sure you want to logout?</p>
        </div>

        <div className="confirm-footer">
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className="btn danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
