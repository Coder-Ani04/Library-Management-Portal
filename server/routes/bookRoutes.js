const express = require('express');
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getBooks); // Public — students need to browse/search books
router.get('/:id', getBookById); // Public — view single book details
router.post('/', protect, authorize('admin'), createBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

module.exports = router;