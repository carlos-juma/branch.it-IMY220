const { Friendship, User } = require('../models/models');

class FriendshipController {
    // Send friend request
    static async sendFriendRequest(req, res) {
        try {
            const { userId } = req.body; // User to send request to
            const requesterId = req.user._id;

            // Can't send request to yourself
            if (requesterId.equals(userId)) {
                return res.status(400).json({ message: 'Cannot send friend request to yourself' });
            }

            // Check if target user exists
            const targetUser = await User.findById(userId);
            if (!targetUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if friendship already exists
            const existingFriendship = await Friendship.findOne({
                $or: [
                    { requesterId, addresseeId: userId },
                    { requesterId: userId, addresseeId: requesterId }
                ]
            });

            if (existingFriendship) {
                if (existingFriendship.status === 'accepted') {
                    return res.status(400).json({ message: 'Already friends' });
                } else if (existingFriendship.status === 'pending') {
                    return res.status(400).json({ message: 'Friend request already sent' });
                }
            }

            // Create new friend request
            const friendship = new Friendship({
                requesterId,
                addresseeId: userId,
                status: 'pending'
            });

            await friendship.save();
            await friendship.populate('addresseeId', 'name email avatar');

            res.status(201).json(friendship);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get friend requests received
    static async getFriendRequests(req, res) {
        try {
            const requests = await Friendship.find({
                addresseeId: req.user._id,
                status: 'pending'
            }).populate('requesterId', 'name email avatar');

            res.json(requests);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get sent friend requests
    static async getSentRequests(req, res) {
        try {
            const requests = await Friendship.find({
                requesterId: req.user._id,
                status: 'pending'
            }).populate('addresseeId', 'name email avatar');

            res.json(requests);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Accept friend request
    static async acceptFriendRequest(req, res) {
        try {
            const friendship = await Friendship.findById(req.params.requestId);

            if (!friendship) {
                return res.status(404).json({ message: 'Friend request not found' });
            }

            // Only the addressee can accept
            if (!friendship.addresseeId.equals(req.user._id)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            if (friendship.status !== 'pending') {
                return res.status(400).json({ message: 'Request is not pending' });
            }

            friendship.status = 'accepted';
            await friendship.save();

            // Add each other to friends list
            await User.findByIdAndUpdate(friendship.requesterId, {
                $addToSet: { friends: friendship.addresseeId }
            });
            await User.findByIdAndUpdate(friendship.addresseeId, {
                $addToSet: { friends: friendship.requesterId }
            });

            await friendship.populate('requesterId', 'name email avatar');
            res.json(friendship);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Decline friend request
    static async declineFriendRequest(req, res) {
        try {
            const friendship = await Friendship.findById(req.params.requestId);

            if (!friendship) {
                return res.status(404).json({ message: 'Friend request not found' });
            }

            // Only the addressee can decline
            if (!friendship.addresseeId.equals(req.user._id)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            await Friendship.findByIdAndDelete(req.params.requestId);
            res.json({ message: 'Friend request declined' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get friends list
    static async getFriends(req, res) {
        try {
            const user = await User.findById(req.user._id)
                .populate('friends', 'name email avatar bio')
                .select('friends');

            res.json(user.friends);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Unfriend user
    static async unfriend(req, res) {
        try {
            const { friendId } = req.params;
            const userId = req.user._id;

            // Remove friendship record
            await Friendship.findOneAndDelete({
                $or: [
                    { requesterId: userId, addresseeId: friendId },
                    { requesterId: friendId, addresseeId: userId }
                ],
                status: 'accepted'
            });

            // Remove from each other's friends list
            await User.findByIdAndUpdate(userId, {
                $pull: { friends: friendId }
            });
            await User.findByIdAndUpdate(friendId, {
                $pull: { friends: userId }
            });

            res.json({ message: 'Unfriended successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get friendship status with another user
    static async getFriendshipStatus(req, res) {
        try {
            const { userId } = req.params;
            const currentUserId = req.user._id;

            const friendship = await Friendship.findOne({
                $or: [
                    { requesterId: currentUserId, addresseeId: userId },
                    { requesterId: userId, addresseeId: currentUserId }
                ]
            });

            if (!friendship) {
                return res.json({ status: 'none' });
            }

            // Determine the perspective
            let status = friendship.status;
            if (friendship.status === 'pending') {
                if (friendship.requesterId.equals(currentUserId)) {
                    status = 'sent';
                } else {
                    status = 'received';
                }
            }

            res.json({ status, friendship });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = FriendshipController;