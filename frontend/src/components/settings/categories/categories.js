import React, { useCallback, useEffect, useMemo, useState } from 'react';
import '../settings.css';
import './categories.css';
import CategoryModal from './categoryModal';
import {
  fetchCategories as fetchCategoryList,
  createCategory as createCategoryRequest,
  updateCategory as updateCategoryRequest,
  deleteCategory as deleteCategoryRequest,
} from '../../../services/api';
import { useToast } from '../../toast/ToastProvider';

function Dot({ color }) {
  return <span className="dot" style={{ backgroundColor: color }} />;
}

const dispatchCategoriesUpdated = () => {
  window.dispatchEvent(new Event('taxpal:categories-updated'));
};

export default function Categories() {
  const { showToast } = useToast();
  const [tab, setTab] = useState('expense');
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchCategoryList();
      setCategories({
        income: response.income || [],
        expense: response.expense || [],
      });
    } catch (error) {
      const message = error.message || 'Failed to load categories';
      showToast({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const list = useMemo(() => categories[tab] || [], [categories, tab]);

  const openAdd = () => setAddOpen(true);
  const closeAdd = () => setAddOpen(false);

  const handleAddSave = async ({ type, name, color }) => {
    try {
      await createCategoryRequest({ type, name, color });
      showToast({ message: 'Category created successfully' });
      setAddOpen(false);
      await loadCategories();
      dispatchCategoriesUpdated();
    } catch (error) {
      const message = error.message || 'Unable to create category';
      showToast({ message, type: 'error' });
    }
  };

  const startEdit = (category) => {
    setEditing({ ...category });
  };

  const cancelEdit = () => setEditing(null);

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditing((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await updateCategoryRequest(editing.id, { name: editing.name, color: editing.color });
      showToast({ message: 'Category updated successfully' });
      setEditing(null);
      await loadCategories();
      dispatchCategoriesUpdated();
    } catch (error) {
      const message = error.message || 'Unable to update category';
      showToast({ message, type: 'error' });
    }
  };

  const handleDelete = async (id, isDefault) => {
    if (isDefault) {
      showToast({ message: 'Default categories cannot be deleted', type: 'warning' });
      return;
    }
    const confirmed = window.confirm('Delete this category?');
    if (!confirmed) return;
    try {
      await deleteCategoryRequest(id);
      showToast({ message: 'Category deleted successfully' });
      await loadCategories();
      dispatchCategoriesUpdated();
    } catch (error) {
      const message = error.message || 'Unable to delete category';
      showToast({ message, type: 'error' });
    }
  };

  const headerRight = useMemo(
    () => (
      <button className="btn primary" onClick={openAdd} type="button">
        + Add New Category
      </button>
    ),
    []
  );

  return (
    <div className="panel">
      <div className="set-head">
        <div>
          <h2 className="set-title">Category Management</h2>
          <p className="set-sub">Add income or expense categories to tailor your budgets.</p>
        </div>
        <div className="set-actions">{headerRight}</div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'expense' ? 'active' : ''}`} onClick={() => setTab('expense')}>
          Expense Categories
        </button>
        <button className={`tab ${tab === 'income' ? 'active' : ''}`} onClick={() => setTab('income')}>
          Income Categories
        </button>
      </div>

      {loading ? (
        <div className="empty">Loading categories…</div>
      ) : (
        <ul className="cat-list">
          {list.map((cat) => (
            <li key={cat.id || `${cat.type}-${cat.name}`} className="cat-row">
             <div className="cat-main">
               <Dot color={cat.color} />
               {editing?.id === cat.id ? (
                 <input
                   className="edit-input"
                   name="name"
                   value={editing.name}
                   onChange={handleEditChange}
                 />
               ) : (
                 <span className="cat-name">
                   {cat.name}
                   {cat.isDefault && <span className="default-tag">Default</span>}
                 </span>
               )}
             </div>
             <div className="cat-actions">
               {editing?.id === cat.id ? (
                 <>
                    <input
                      type="color"
                      name="color"
                      value={editing.color}
                      onChange={handleEditChange}
                      className="color-input"
                    />
                    <button className="icon-btn" onClick={saveEdit} title="Save">
                      ✔
                    </button>
                    <button className="icon-btn" onClick={cancelEdit} title="Cancel">
                      ↩
                    </button>
                  </>
                ) : (
                  <>
                   <button className="icon-btn" onClick={() => startEdit(cat)} title="Edit">
                     ✎
                   </button>
                    <button
                      className={`icon-btn ${cat.isDefault ? 'disabled' : 'danger'}`}
                      onClick={() => handleDelete(cat.id, cat.isDefault)}
                      title={cat.isDefault ? 'Default categories cannot be deleted' : 'Delete'}
                      disabled={cat.isDefault}
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
          {list.length === 0 && <li className="empty">No categories yet.</li>}
        </ul>
      )}

      <CategoryModal open={addOpen} initialType={tab} onClose={closeAdd} onSave={handleAddSave} />
    </div>
  );
}
