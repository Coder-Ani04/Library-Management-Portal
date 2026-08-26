const BookRequest = require('../models/BookRequest');
const Book = require('../models/Book');
const IssuedBook = require('../models/IssuedBook');
const env = require('../config/env');

// @desc    Student creates a request to borrow a book
// @route   POST /api/requests
// @access  Private/Student
const createRequest = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({
        success: false,
        message: 'No copies of this book are currently available',
      });
    }

    // Prevent duplicate pending requests for the same book by the same student
    const existingPending = await BookRequest.findOne({
      student: req.user._id,
      book: bookId,
      status: 'pending',
    });
    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this book',
      });
    }

    // Prevent requesting a book they already have issued
    const alreadyIssued = await IssuedBook.findOne({
      student: req.user._id,
      book: bookId,
      status: 'issued',
    });
    if (alreadyIssued) {
      return res.status(400).json({
        success: false,
        message: 'You already have this book issued',
      });
    }

    const request = await BookRequest.create({
      student: req.user._id,
      book: bookId,
    });

    const populated = await request.populate('book', 'title author');

    res.status(201).json({
      success: true,
      message: 'Book request submitted successfully',
      request: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating request',
      error: error.message,
    });
  }
};

// @desc    Get requests (student: own only, admin: all)
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const requests = await BookRequest.find(query)
      .populate('student', 'name email studentId')
      .populate('book', 'title author availableCopies')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await BookRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching requests',
      error: error.message,
    });
  }
};

// @desc    Admin approves a request — creates the actual IssuedBook record
// @route   PUT /api/requests/:id/approve
// @access  Private/Admin
const approveRequest = async (req, res) => {
  try {
    const request = await BookRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status}`,
      });
    }

    const book = await Book.findById(request.book);
    if (!book || book.availableCopies < 1) {
      return res.status(400).json({
        success: false,
        message: 'No copies of this book are currently available',
      });
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + env.ISSUE_PERIOD_DAYS);

    const issuedBook = await IssuedBook.create({
      student: request.student,
      book: request.book,
      issueDate,
      dueDate,
      issuedBy: req.user._id,
    });

    book.availableCopies -= 1;
    await book.save();

    request.status = 'approved';
    request.processedBy = req.user._id;
    request.processedAt = new Date();
    request.issuedBook = issuedBook._id;
    await request.save();

    const populated = await request.populate([
      { path: 'student', select: 'name email studentId' },
      { path: 'book', select: 'title author' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Request approved and book issued',
      request: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error approving request',
      error: error.message,
    });
  }
};

// @desc    Admin rejects a request
// @route   PUT /api/requests/:id/reject
// @access  Private/Admin
const rejectRequest = async (req, res) => {
  try {
    const { reason } = req.body;

    const request = await BookRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status}`,
      });
    }

    request.status = 'rejected';
    request.rejectionReason = reason || 'No reason provided';
    request.processedBy = req.user._id;
    request.processedAt = new Date();
    await request.save();

    const populated = await request.populate([
      { path: 'student', select: 'name email studentId' },
      { path: 'book', select: 'title author' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Request rejected',
      request: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error rejecting request',
      error: error.message,
    });
  }
};

module.exports = { createRequest, getRequests, approveRequest, rejectRequest };