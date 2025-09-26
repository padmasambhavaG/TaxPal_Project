import React, { useMemo, useState } from "react";
import "../settings.css";
import "./categories.css";
import CategoryModal from "./categoryModal";

const seedExpense = [
  { id:"1", name:"Business Expenses", color:"#ef4444" },
  { id:"2", name:"Office Rent", color:"#eab308" },
  { id:"3", name:"Software Subscriptions", color:"#22c55e" },
];
const seedIncome = [
  { id:"a", name:"Salary", color:"#22c55e" },
  { id:"b", name:"Freelance", color:"#06b6d4" },
];

function Dot({ color }) { return <span className="dot" style={{backgroundColor:color}} />; }

export default function Categories() {
  const [tab, setTab] = useState("expense");
  const [expense, setExpense] = useState(seedExpense);
  const [income, setIncome] = useState(seedIncome);
  const [editing, setEditing] = useState(null); // inline edit
  const [addOpen, setAddOpen] = useState(false);

  const list = tab === "expense" ? expense : income;
  const setList = tab === "expense" ? setExpense : setIncome;

  const openAdd = () => setAddOpen(true);
  const closeAdd = () => setAddOpen(false);

  const onAddSave = ({ type, name, color }) => {
    const id = Math.random().toString(36).slice(2);
    if (type === "expense") setExpense(arr => [...arr, { id, name, color }]);
    else setIncome(arr => [...arr, { id, name, color }]);
    setAddOpen(false);
  };

  const onDelete = (id) => setList(arr => arr.filter(c => c.id !== id));
  const onEdit = (cat) => setEditing(cat);
  const onEditSave = () => {
    setList(arr => arr.map(c => c.id === editing.id ? editing : c));
    setEditing(null);
  };

  const headerRight = useMemo(() => (
    <button className="btn primary" onClick={openAdd} type="button">+ Add New Category</button>
  ), []);

  return (
    <div className="panel">
      <div className="set-head">
        <div><h2 className="set-title">Category Management</h2><p className="set-sub">Add income or expense categories using the popup.</p></div>
        <div className="set-actions">{headerRight}</div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab==="expense"?"active":""}`} onClick={()=>setTab("expense")}>Expense Categories</button>
        <button className={`tab ${tab==="income"?"active":""}`} onClick={()=>setTab("income")}>Income Categories</button>
      </div>

      <ul className="cat-list">
        {list.map(cat => (
          <li key={cat.id} className="cat-row">
            <div className="cat-main">
              <Dot color={cat.color}/>
              {editing?.id === cat.id ? (
                <input
                  className="edit-input"
                  value={editing.name}
                  onChange={(e)=>setEditing(s=>({...s, name:e.target.value}))}
                />
              ) : (
                <span className="cat-name">{cat.name}</span>
              )}
            </div>
            <div className="cat-actions">
              {editing?.id === cat.id ? (
                <>
                  <button className="icon-btn" onClick={onEditSave} title="Save">✔</button>
                  <button className="icon-btn" onClick={()=>setEditing(null)} title="Cancel">↩</button>
                </>
              ) : (
                <>
                  <button className="icon-btn" onClick={()=>onEdit(cat)} title="Edit">✎</button>
                  <button className="icon-btn danger" onClick={()=>onDelete(cat.id)} title="Delete">✕</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <CategoryModal
        open={addOpen}
        initialType={tab}
        onClose={closeAdd}
        onSave={onAddSave}
      />
    </div>
  );
}
