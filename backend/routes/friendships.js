const express = require('express');
const router = express.Router();
const FriendshipController = require('../controllers/friendshipController');
const auth = require('../middleware/auth');

// All friendship routes require authentication
router.use(auth);

// Send friend request
router.post('/request', FriendshipController.sendFriendRequest);

// Get friend requests (received)
router.get('/requests', FriendshipController.getFriendRequests);

// Get sent friend requests
router.get('/requests/sent', FriendshipController.getSentRequests);

// Accept friend request
router.put('/accept/:requestId', FriendshipController.acceptFriendRequest);

// Decline friend request
router.delete('/decline/:requestId', FriendshipController.declineFriendRequest);

// Get friends list
router.get('/', FriendshipController.getFriends);

// Unfriend user
router.delete('/:friendId', FriendshipController.unfriend);

// Get friendship status with another user
router.get('/status/:userId', FriendshipController.getFriendshipStatus);

module.exports = router;