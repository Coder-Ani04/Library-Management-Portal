const IssuedBook = require('../models/IssuedBook');
const Book = require('../models/Book');
const Fine = require('../models/Fine');
const User = require('../models/User');
const env = require('../config/env');

// @desc    Issue a book to a student
// @route   POST /api/issues
// @access  Private/Admin
const issueBook = async (req, res) => {
  try {
    const { studentId, bookId } = req.body;

    // Verify student exists and is actually a student
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Verify book exists and has available copies
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({
        success: false,
        message: 'No copies of this book are currently available',
      });
    }

    // Prevent issuing the same book twice to the same student while still outstanding
    const alreadyIssued = await IssuedBook.findOne({
      student: studentId,
      book: bookId,
      status: 'issued',
    });
    if (alreadyIssued) {
      return res.status(400).json({
        success: false,
        message: 'This student already has this book issued',
      });
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + env.ISSUE_PERIOD_DAYS);

    const issuedBook = await IssuedBook.create({
      student: studentId,
      book: bookId,
      issueDate,
      dueDate,
      issuedBy: req.user._id,
    });

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    const populatedIssue = await issuedBook.populate([
      { path: 'student', select: 'name email studentId' },
      { path: 'book', select: 'title author isbn' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Book issued successfully',
      issuedBook: populatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error issuing book',
      error: error.message,
    });
  }
};

// @desc    Return a book
// @route   PUT /api/issues/:id/return
// @access  Private/Admin
const returnBook = async (req, res) => {
  try {
    const issuedBook = await IssuedBook.findById(req.params.id);

    if (!issuedBook) {
      return res.status(404).json({
        success: false,
        message: 'Issued book record not found',
      });
    }

    if (issuedBook.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'This book has already been returned',
      });
    }

    const returnDate = new Date();
    issuedBook.returnDate = returnDate;
    issuedBook.status = 'returned';
    await issuedBook.save();

    // Increment available copies back
    const book = await Book.findById(issuedBook.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    // Auto-calculate fine if returned late
    let fine = null;
    if (returnDate > issuedBook.dueDate) {
      const msLate = returnDate - issuedBook.dueDate;
      const daysLate = Math.ceil(msLate / (1000 * 60 * 60 * 24));
      const amount = daysLate * env.FINE_PER_DAY;

      fine = await Fine.create({
        student: issuedBook.student,
        issuedBook: issuedBook._id,
        amount,
        daysLate,
      });
    }

    const populatedIssue = await issuedBook.populate([
      { path: 'student', select: 'name email studentId' },
      { path: 'book', select: 'title author isbn' },
    ]);

    res.status(200).json({
      success: true,
      message: fine
        ? `Book returned successfully. A fine of ₹${fine.amount} has been applied for ${fine.daysLate} day(s) late.`
        : 'Book returned successfully',
      issuedBook: populatedIssue,
      fine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error returning book',
      error: error.message,
    });
  }
};

// @desc    Get all issued books (admin: all records, student: their own only)
// @route   GET /api/issues
// @access  Private
const getIssuedBooks = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};

    // Students can only see their own records — admins see everything
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const issuedBooks = await IssuedBook.find(query)
      .populate('student', 'name email studentId')
      .populate('book', 'title author isbn')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await IssuedBook.countDocuments(query);

    res.status(200).json({
      success: true,
      count: issuedBooks.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      issuedBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching issued books',
      error: error.message,
    });
  }
};

module.exports = { issueBook, returnBook, getIssuedBooks };