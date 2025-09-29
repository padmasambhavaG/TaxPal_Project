import React, { useEffect } from "react";
import { createPortal } from "react-dom";


export default function ConfirmLogout({ open, onCancel, onConfirm }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="confirm-backdrop" role="dialog" aria-modal="true">
      <div className="confirm-sheet">
        <div className="confirm-header">
          <h3>Delete Account</h3>
          <button className="icon-btn" type="button" onClick={onCancel}>✕</button>
        </div>
        <div className="confirm-body">
          <img
            src="/warnings.png"
            alt="Logout illustration"
            className="confirm-illustration"
          />
          <p>Are you sure you want to delete this <b>account permanently</b>?. Once this action is performed it cannot be undone.</p>
        </div>
        <div className="confirm-footer">
          <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>
          <button className="btn danger" type="button" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
