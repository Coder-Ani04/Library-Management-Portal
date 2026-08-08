const express = require('express');
const { getFines, payFine } = require('../controllers/fineController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getFines);
router.put('/:id/pay', protect, authorize('admin'), payFine);

module.exports = router;