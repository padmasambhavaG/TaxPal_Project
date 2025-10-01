import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmLogout from "../../logout/confirmLogout";
import "../settings.css";
import DeleteAccount from "../deleteAccount/deleteAccount";

export default function Security() {
  const navigate = useNavigate();

  // Logout modal state
  const [showConfirm, setShowConfirm] = useState(false);

  // Delete account modal state
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Logout modal handlers
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

  // Navigation
  const goChangePassword = () => navigate("/reset-password");

  // Delete account modal handlers
  const openConfirmDelete = () => setShowConfirmDelete(true);
  const cancelDelete = () => {
    if (!deleting) setShowConfirmDelete(false);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);

      // TODO: Replace with real API call
      // const token = localStorage.getItem("token");
      // const res = await fetch("/api/account", {
      //   method: "DELETE",
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // if (!res.ok) throw new Error("Delete failed");

      // Simulate latency
      await new Promise((r) => setTimeout(r, 600));

      // On success: clear auth and redirect to signup
      localStorage.removeItem("token");
      setShowConfirmDelete(false);
      navigate("/signup");
    } catch (err) {
      console.error(err);
      alert("Unable to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

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
            <p>Sign out from this device and browser.</p>
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
              <button className="btn34" type="button" onClick={goChangePassword}>
                Change password
              </button>
            </div>
          </div>

          <div className="card">
            <h4>Delete Account</h4>
            <p>Delete your account permanently.</p>
            <div className="toolbar">
              <button
                className="btn danger"
                type="button"
                onClick={openConfirmDelete}
                disabled={deleting}
                aria-disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete permanently"}
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

      {/* DeleteAccount modal */}
      <DeleteAccount
        open={showConfirmDelete}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}
