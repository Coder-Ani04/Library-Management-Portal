const mongoose = require('mongoose');

const bookRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    issuedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IssuedBook',
      default: null, // Set once approved, links to the resulting issue record
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BookRequest', bookRequestSchema);