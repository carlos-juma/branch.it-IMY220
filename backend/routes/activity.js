const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

// All activity routes require authentication
router.use(auth);

// Get personal activity feed (friends + own activity)
router.get('/feed', ActivityController.getPersonalFeed);

// Get global activity feed (all users)
router.get('/global', ActivityController.getGlobalFeed);

// Get user's own activity
router.get('/user/:userId', ActivityController.getUserActivity);

// Create activity entry
router.post('/', ActivityController.createActivity);

module.exports = router;