const express = require('express');
const { issueBook, returnBook, getIssuedBooks } = require('../controllers/issueController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getIssuedBooks); // Both roles allowed — filtered by role inside controller
router.post('/', protect, authorize('admin'), issueBook);
router.put('/:id/return', protect, authorize('admin'), returnBook);

module.exports = router;