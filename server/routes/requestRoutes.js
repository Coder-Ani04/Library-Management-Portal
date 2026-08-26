const express = require('express');
const {
  createRequest,
  getRequests,
  approveRequest,
  rejectRequest,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getRequests);
router.post('/', protect, authorize('student'), createRequest);
router.put('/:id/approve', protect, authorize('admin'), approveRequest);
router.put('/:id/reject', protect, authorize('admin'), rejectRequest);

module.exports = router;