const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issuedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IssuedBook',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Fine amount cannot be negative'],
    },
    daysLate: {
      type: Number,
      required: true,
      min: [1, 'Days late must be at least 1'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    paidDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Fine', fineSchema);