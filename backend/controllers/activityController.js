const { User, Project, Commit, Message } = require('../models/models');

class ActivityController {
    // Get personal activity feed (friends + own activity)
    static async getPersonalFeed(req, res) {
        try {
            const user = await User.findById(req.user._id).populate('friends');
            const friendIds = user.friends.map(friend => friend._id);
            const userIds = [req.user._id, ...friendIds];

            // Get recent commits from friends and self
            const commits = await Commit.find({ authorId: { $in: userIds } })
                .populate('authorId', 'name email avatar')
                .populate('projectId', 'name description type')
                .sort({ timestamp: -1 })
                .limit(50);

            // Get recent project activities
            const messages = await Message.find({ 
                userId: { $in: userIds },
                type: { $in: ['commit', 'system'] }
            })
                .populate('userId', 'name email avatar')
                .populate('projectId', 'name description type')
                .sort({ timestamp: -1 })
                .limit(20);

            // Combine and sort activities
            const activities = [
                ...commits.map(commit => ({
                    type: 'commit',
                    data: commit,
                    timestamp: commit.timestamp,
                    user: commit.authorId,
                    project: commit.projectId
                })),
                ...messages.map(message => ({
                    type: 'message',
                    data: message,
                    timestamp: message.timestamp,
                    user: message.userId,
                    project: message.projectId
                }))
            ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
             .slice(0, 50);

            res.json(activities);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get global activity feed (all users)
    static async getGlobalFeed(req, res) {
        try {
            // Get recent commits from all users
            const commits = await Commit.find()
                .populate('authorId', 'name email avatar')
                .populate('projectId', 'name description type')
                .sort({ timestamp: -1 })
                .limit(30);

            // Get recent public project activities
            const messages = await Message.find({ 
                type: { $in: ['commit', 'system'] }
            })
                .populate('userId', 'name email avatar')
                .populate('projectId', 'name description type')
                .sort({ timestamp: -1 })
                .limit(20);

            // Combine and sort activities
            const activities = [
                ...commits.map(commit => ({
                    type: 'commit',
                    data: commit,
                    timestamp: commit.timestamp,
                    user: commit.authorId,
                    project: commit.projectId
                })),
                ...messages.map(message => ({
                    type: 'message',
                    data: message,
                    timestamp: message.timestamp,
                    user: message.userId,
                    project: message.projectId
                }))
            ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
             .slice(0, 50);

            res.json(activities);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get specific user's activity
    static async getUserActivity(req, res) {
        try {
            const { userId } = req.params;

            // Get user's commits
            const commits = await Commit.find({ authorId: userId })
                .populate('authorId', 'name email avatar')
                .populate('projectId', 'name description type')
                .sort({ timestamp: -1 })
                .limit(30);

            // Get user's messages
            const messages = await Message.find({ 
                userId,
                type: { $in: ['commit', 'comment'] }
            })
                .populate('userId', 'name email avatar')
                .populate('projectId', 'name description type')
                .sort({ timestamp: -1 })
                .limit(20);

            const activities = [
                ...commits.map(commit => ({
                    type: 'commit',
                    data: commit,
                    timestamp: commit.timestamp,
                    user: commit.authorId,
                    project: commit.projectId
                })),
                ...messages.map(message => ({
                    type: 'message',
                    data: message,
                    timestamp: message.timestamp,
                    user: message.userId,
                    project: message.projectId
                }))
            ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            res.json(activities);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Create activity entry
    static async createActivity(req, res) {
        try {
            const { projectId, message, type, metadata } = req.body;

            const activity = new Message({
                projectId,
                userId: req.user._id,
                message,
                type: type || 'comment',
                metadata: metadata || {}
            });

            await activity.save();
            await activity.populate('userId', 'name email avatar');
            await activity.populate('projectId', 'name description type');

            res.status(201).json(activity);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = ActivityController;