const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    publishedYear: {
      type: Number,
      min: [1000, 'Please enter a valid year'],
      max: [new Date().getFullYear(), 'Published year cannot be in the future'],
    },
    coverImage: {
      type: String, // URL to cover image — file upload handling comes later if needed
      trim: true,
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies is required'],
      min: [1, 'Total copies must be at least 1'],
    },
    availableCopies: {
      type: Number,
      required: true,
      min: [0, 'Available copies cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevents inconsistent data — available copies can never exceed total copies
bookSchema.pre('save', function () {
  if (this.availableCopies > this.totalCopies) {
    this.availableCopies = this.totalCopies;
  }
});

// Indexes for fast search — title and author are the primary search fields
bookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', bookSchema);