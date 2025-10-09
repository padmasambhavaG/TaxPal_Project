const mongoose = require('mongoose');
const Report = require('../models/Report');

exports.listReports = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user identifier' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const reports = await Report.find({ user: userObjectId }).sort({ createdAt: -1 }).lean();

    return res.json({ reports });
  } catch (error) {
    console.error('Failed to fetch reports', error);
    return res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

exports.createReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, period, reportType, format, filePath, payload } = req.body;

    if (!name || !period || !reportType || !format) {
      return res.status(422).json({ message: 'Name, period, report type and format are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user identifier' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const report = await Report.create({
      user: userObjectId,
      name,
      period,
      reportType,
      format,
      filePath,
      payload,
    });

    return res.status(201).json({ message: 'Report saved', report });
  } catch (error) {
    console.error('Failed to save report', error);
    return res.status(500).json({ message: 'Failed to save report' });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid identifier' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const report = await Report.findOneAndDelete({ _id: id, user: userObjectId });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    return res.json({ message: 'Report deleted' });
  } catch (error) {
    console.error('Failed to delete report', error);
    return res.status(500).json({ message: 'Failed to delete report' });
  }
};
