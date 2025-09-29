import React, { useState } from "react";
import "../settings.css";
import "./profile.css";

export default function Profile() {
  const [form, setForm] = useState({
    username: "alexmorgan",
    countryName: "India",
    email: "alex.morgan@email.com",
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSave = (e) => {
    e.preventDefault();
    alert("Profile saved");
  };

  return (
    <form className="panel" onSubmit={onSave}>
      <div className="set-head">
        <h2 className="set-title">Profile</h2>
        <p className="set-sub">Manage account details.</p>
      </div>

      <div className="grid-2">
        {/* Username (editable with edit icon) */}
        <label className="set-field editable">
          <span className="set-label">Username</span>
          <div className="input-wrap">
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              autoComplete="username"
              aria-label="Username"
            />
            <span className="edit-icon" aria-hidden="true" title="Editable">
              ✎
            </span>
          </div>
        </label>

        {/* Country (editable with edit icon) */}
        <label className="set-field editable">
          <span className="set-label">Country</span>
          <div className="input-wrap">
            <input
              name="countryName"
              value={form.countryName}
              onChange={onChange}
              autoComplete="country-name"
              aria-label="Country"
            />
            <span className="edit-icon" aria-hidden="true" title="Editable">
              ✎
            </span>
          </div>
        </label>

        {/* Email (read-only with pointer cursor) */}
        <label className="set-field">
          <span className="set-label">Email</span>
          <div className="input-wrap">
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="input-readonly pointer"
              autoComplete="email"
              aria-label="Email (read only)"
              tabIndex={0}
            />
          </div>
        </label>
      </div>

      <div className="toolbar">
        <button className="btn primary" type="submit">
          Save changes
        </button>
      </div>
    </form>
  );
}