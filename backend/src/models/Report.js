const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      type: String,
      required: true,
      trim: true,
    },
    reportType: {
      type: String,
      required: true,
      trim: true,
    },
    format: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      trim: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

reportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
