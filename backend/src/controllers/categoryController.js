const mongoose = require('mongoose');
const Category = require('../models/Category');

const DEFAULT_CATEGORIES = {
  income: [
    { name: 'Salary', color: '#1d4ed8' },
    { name: 'Freelance', color: '#0ea5e9' },
    { name: 'Investments', color: '#22c55e' },
    { name: 'Interest', color: '#6366f1' },
  ],
  expense: [
    { name: 'Utilities', color: '#0ea5e9' },
    { name: 'Food', color: '#f97316' },
    { name: 'Rent', color: '#f43f5e' },
    { name: 'Transport', color: '#22d3ee' },
    { name: 'Software', color: '#a855f7' },
    { name: 'Marketing', color: '#eab308' },
  ],
};

const ensureObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid identifier');
  }
  return new mongoose.Types.ObjectId(id);
};

const mapCategories = (categories) =>
  categories.map((cat) => ({
    id: cat._id ? cat._id.toString() : undefined,
    name: cat.name,
    type: cat.type,
    color: cat.color,
    isDefault: Boolean(cat.isDefault),
  }));

exports.listCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    ensureObjectId(userId);

    await createDefaultSet();

    const defaults = await Category.find({ isDefault: true }).lean();
    const userCategories = await Category.find({ user: userId }).lean();

    const income = [];
    const expense = [];

    mapCategories(defaults.concat(userCategories)).forEach((cat) => {
      if (cat.type === 'income') {
        income.push(cat);
      } else {
        expense.push(cat);
      }
    });

    return res.json({
      income,
      expense,
      all: [...income, ...expense],
    });
  } catch (error) {
    console.error('Failed to list categories', error);
    return res.status(500).json({ message: 'Failed to load categories' });
  }
};

const createDefaultSet = async () => {
  const existingDefaults = await Category.find({ isDefault: true }).lean();
  if (existingDefaults.length > 0) {
    return;
  }

  const toCreate = Object.entries(DEFAULT_CATEGORIES).flatMap(([type, cats]) =>
    cats.map((cat) => ({ ...cat, type, isDefault: true }))
  );

  if (toCreate.length > 0) {
    await Category.insertMany(toCreate, { ordered: false }).catch(() => {});
  }
};

exports.seedDefaults = createDefaultSet;

exports.createCategory = async (req, res) => {
  try {
    const userId = ensureObjectId(req.user.id);
    const { name, type, color } = req.body;

    if (!name || !['income', 'expense'].includes(type)) {
      return res.status(422).json({ message: 'Name and valid type are required' });
    }

    const category = await Category.create({
      user: userId,
      name: name.trim(),
      type,
      color: color || '#6366f1',
      isDefault: false,
    });

    return res.status(201).json({
      message: 'Category created successfully',
      category: mapCategories([category])[0],
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Category already exists' });
    }
    console.error('Failed to create category', error);
    return res.status(500).json({ message: 'Failed to create category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    ensureObjectId(req.user.id);
    ensureObjectId(id);

    const update = {};
    ['name', 'color'].forEach((field) => {
      if (typeof req.body[field] !== 'undefined') {
        update[field] = field === 'name' ? req.body[field].trim() : req.body[field];
      }
    });

    const category = await Category.findOneAndUpdate(
      { _id: id, user: req.user.id },
      update,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json({ message: 'Category updated successfully', category: mapCategories([category])[0] });
  } catch (error) {
    console.error('Failed to update category', error);
    return res.status(500).json({ message: 'Failed to update category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    ensureObjectId(req.user.id);
    ensureObjectId(id);

    const category = await Category.findOneAndDelete({ _id: id, user: req.user.id });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Failed to delete category', error);
    return res.status(500).json({ message: 'Failed to delete category' });
  }
};
