const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');
const auth = require('../middleware/auth');

// All search routes require authentication
router.use(auth);

// Search users
router.get('/users', SearchController.searchUsers);

// Search projects
router.get('/projects', SearchController.searchProjects);

// Search commits/check-ins
router.get('/commits', SearchController.searchCommits);

// Global search (all types)
router.get('/all', SearchController.globalSearch);

module.exports = router;