const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.get('/search', auth, UserController.searchUsers);
router.get('/:id', auth, UserController.getProfile);
router.put('/:id', auth, UserController.updateProfile);
router.delete('/:id', auth, UserController.deleteAccount);

module.exports = router;