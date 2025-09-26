import React, { useState } from "react";
import "../settings.css";

export default function Profile() {
  const [form, setForm] = useState({ firstName:"Alex", lastName:"Morgan", email:"alex.morgan@email.com" });
  const onChange = e => setForm(f=>({...f, [e.target.name]: e.target.value}));
  const onSave = e => { e.preventDefault(); alert("Profile saved"); };

  return (
    <form className="panel" onSubmit={onSave}>
      <div className="set-head"><h2 className="set-title">Profile</h2><p className="set-sub">Manage account details.</p></div>
      <div className="grid-2">
        <label className="set-field"><span className="set-label">First name</span><input name="firstName" value={form.firstName} onChange={onChange}/></label>
        <label className="set-field"><span className="set-label">Last name</span><input name="lastName" value={form.lastName} onChange={onChange}/></label>
        <label className="set-field"><span className="set-label">Email</span><input type="email" name="email" value={form.email} onChange={onChange}/></label>
      </div>
      <div className="toolbar"><button className="btn primary" type="submit">Save changes</button></div>
    </form>
  );
}
