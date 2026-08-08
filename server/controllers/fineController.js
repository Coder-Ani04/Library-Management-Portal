const Fine = require('../models/Fine');

// @desc    Get all fines (admin: all, student: their own)
// @route   GET /api/fines
// @access  Private
const getFines = async (req, res) => {
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

    const fines = await Fine.find(query)
      .populate('student', 'name email studentId')
      .populate({
        path: 'issuedBook',
        populate: { path: 'book', select: 'title author' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Fine.countDocuments(query);

    res.status(200).json({
      success: true,
      count: fines.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      fines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching fines',
      error: error.message,
    });
  }
};

// @desc    Mark a fine as paid
// @route   PUT /api/fines/:id/pay
// @access  Private/Admin
const payFine = async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id);

    if (!fine) {
      return res.status(404).json({
        success: false,
        message: 'Fine record not found',
      });
    }

    if (fine.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This fine has already been paid',
      });
    }

    fine.status = 'paid';
    fine.paidDate = new Date();
    await fine.save();

    res.status(200).json({
      success: true,
      message: 'Fine marked as paid',
      fine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating fine',
      error: error.message,
    });
  }
};

module.exports = { getFines, payFine };