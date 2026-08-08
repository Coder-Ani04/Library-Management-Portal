const Book = require('../models/Book');
const Category = require('../models/Category');

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      description,
      publishedYear,
      coverImage,
      totalCopies,
    } = req.body;

    // Verify the referenced category actually exists before creating the book
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category — category does not exist',
      });
    }

    const existingIsbn = await Book.findOne({ isbn });
    if (existingIsbn) {
      return res.status(400).json({
        success: false,
        message: 'A book with this ISBN already exists',
      });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      description,
      publishedYear,
      coverImage,
      totalCopies,
      availableCopies: totalCopies, // New book starts with all copies available
    });

    const populatedBook = await book.populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book: populatedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating book',
      error: error.message,
    });
  }
};

// @desc    Get all books (with search, filter, pagination)
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const query = {};

    // Full-text search on title/author using the text index we defined
    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const books = await Book.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching books',
      error: error.message,
    });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category', 'name');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching book',
      error: error.message,
    });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    const allowedFields = [
      'title',
      'author',
      'isbn',
      'category',
      'description',
      'publishedYear',
      'coverImage',
      'totalCopies',
    ];

    // If category is being changed, verify the new one exists
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category — category does not exist',
        });
      }
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
      }
    });

    // If totalCopies increased, add the difference to availableCopies too
    // (so newly added copies are immediately available to borrow)
    if (req.body.totalCopies !== undefined) {
      const diff = req.body.totalCopies - book.totalCopies;
      if (diff > 0) {
        book.availableCopies += diff;
      }
    }

    await book.save();
    const populatedBook = await book.populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      book: populatedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating book',
      error: error.message,
    });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Prevent deleting a book that currently has copies issued out
    if (book.availableCopies < book.totalCopies) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book — some copies are currently issued to students',
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting book',
      error: error.message,
    });
  }
};

module.exports = { createBook, getBooks, getBookById, updateBook, deleteBook };