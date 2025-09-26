import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmLogout from "../../logout/confirmLogout";
import "../settings.css";

export default function Security() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const openConfirm = () => setShowConfirm(true);
  const cancel = () => setShowConfirm(false);

  const confirm = () => {
    // Perform logout logic here
    localStorage.removeItem("token");

    // Close the modal
    setShowConfirm(false);

    // Now redirect
    navigate("/signin");
  };

  const goChangePassword = () => navigate("/reset-password");

  return (
    <>
      <div className="panel">
        <div className="set-head">
          <h2 className="set-title">Security</h2>
          <p className="set-sub">Protect the account and sessions.</p>
        </div>

        <div className="security-grid">
          <div className="card">
            <h4>Active sessions</h4>
            <p>Sign out from this device.</p>
            <div className="toolbar">
              <button className="btn danger" type="button" onClick={openConfirm}>
                Sign out all
              </button>
            </div>
          </div>

          <div className="card">
            <h4>Password</h4>
            <p>Update a strong, unique password.</p>
            <div className="toolbar">
              <button className="btn" type="button" onClick={goChangePassword}>
                Change password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ConfirmLogout modal */}
      <ConfirmLogout 
        open={showConfirm} 
        onCancel={cancel} 
        onConfirm={confirm} 
      />
    </>
  );
}
