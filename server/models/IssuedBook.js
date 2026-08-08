const mongoose = require('mongoose');

const issuedBookSchema = new mongoose.Schema(
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
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['issued', 'returned'],
      default: 'issued',
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The admin who issued the book
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Fast lookups for "does this student already have this book issued"
issuedBookSchema.index({ student: 1, book: 1, status: 1 });

module.exports = mongoose.model('IssuedBook', issuedBookSchema);