const { User, Project, Commit } = require('../models/models');

class SearchController {
    // Search users
    static async searchUsers(req, res) {
        try {
            const { query } = req.query;
            
            if (!query || query.trim().length < 2) {
                return res.status(400).json({ message: 'Query must be at least 2 characters' });
            }

            const users = await User.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            })
            .select('name email avatar bio')
            .limit(20);

            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Search projects
    static async searchProjects(req, res) {
        try {
            const { query, type, tags } = req.query;
            
            let searchCriteria = { isPublic: true };

            if (query && query.trim()) {
                searchCriteria.$or = [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ];
            }

            if (type) {
                searchCriteria.type = { $regex: type, $options: 'i' };
            }

            if (tags) {
                const tagArray = Array.isArray(tags) ? tags : [tags];
                searchCriteria.tags = { $in: tagArray };
            }

            const projects = await Project.find(searchCriteria)
                .populate('ownerId', 'name email avatar')
                .sort({ createdAt: -1 })
                .limit(30);

            res.json(projects);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Search commits/check-ins
    static async searchCommits(req, res) {
        try {
            const { query, projectType, hashtags } = req.query;
            
            let pipeline = [];

            // Match commits based on message
            let matchStage = {};
            if (query && query.trim()) {
                matchStage.message = { $regex: query, $options: 'i' };
            }

            if (Object.keys(matchStage).length > 0) {
                pipeline.push({ $match: matchStage });
            }

            // Lookup project details
            pipeline.push({
                $lookup: {
                    from: 'projects',
                    localField: 'projectId',
                    foreignField: '_id',
                    as: 'project'
                }
            });

            pipeline.push({ $unwind: '$project' });

            // Filter by project type or hashtags
            let projectMatchStage = {};
            if (projectType) {
                projectMatchStage['project.type'] = { $regex: projectType, $options: 'i' };
            }

            if (hashtags) {
                const tagArray = Array.isArray(hashtags) ? hashtags : [hashtags];
                projectMatchStage['project.tags'] = { $in: tagArray };
            }

            if (Object.keys(projectMatchStage).length > 0) {
                pipeline.push({ $match: projectMatchStage });
            }

            // Lookup author details
            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }
            });

            pipeline.push({ $unwind: '$author' });

            // Sort and limit
            pipeline.push({ $sort: { timestamp: -1 } });
            pipeline.push({ $limit: 50 });

            // Project final fields
            pipeline.push({
                $project: {
                    message: 1,
                    timestamp: 1,
                    hash: 1,
                    branch: 1,
                    'project.name': 1,
                    'project.description': 1,
                    'project.type': 1,
                    'project.tags': 1,
                    'author.name': 1,
                    'author.email': 1,
                    'author.avatar': 1
                }
            });

            const commits = await Commit.aggregate(pipeline);
            res.json(commits);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Global search (all types)
    static async globalSearch(req, res) {
        try {
            const { query } = req.query;
            
            if (!query || query.trim().length < 2) {
                return res.status(400).json({ message: 'Query must be at least 2 characters' });
            }

            // Search users
            const users = await User.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            })
            .select('name email avatar bio')
            .limit(10);

            // Search projects
            const projects = await Project.find({
                isPublic: true,
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { tags: { $in: [new RegExp(query, 'i')] } }
                ]
            })
            .populate('ownerId', 'name email avatar')
            .limit(15);

            // Search commits
            const commits = await Commit.find({
                message: { $regex: query, $options: 'i' }
            })
            .populate('authorId', 'name email avatar')
            .populate('projectId', 'name description type')
            .sort({ timestamp: -1 })
            .limit(10);

            res.json({
                users: users.map(user => ({ ...user.toObject(), type: 'user' })),
                projects: projects.map(project => ({ ...project.toObject(), type: 'project' })),
                commits: commits.map(commit => ({ ...commit.toObject(), type: 'commit' }))
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = SearchController;