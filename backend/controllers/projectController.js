const { Project, File, Commit, User } = require('../models/models');
const mongoose = require('mongoose');

class ProjectController {
    // Get all public projects
    static async getAllProjects(req, res) {
        try {
            const projects = await Project.find({ isPublic: true })
                .populate('ownerId', 'name email avatar')
                .populate('collaborators', 'name email avatar')
                .sort({ createdAt: -1 });
            
            res.json(projects);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get specific project
    static async getProject(req, res) {
        try {
            const project = await Project.findById(req.params.id)
                .populate('ownerId', 'name email avatar')
                .populate('collaborators', 'name email avatar');
            
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // Check if project is public or user has access
            if (!project.isPublic && req.user) {
                const hasAccess = project.ownerId._id.equals(req.user._id) || 
                    project.collaborators.some(collab => collab._id.equals(req.user._id));
                
                if (!hasAccess) {
                    return res.status(403).json({ message: 'Access denied' });
                }
            }

            res.json(project);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Create new project
    static async createProject(req, res) {
        try {
            const { name, description, type, tags, isPublic = true } = req.body;
            
            const project = new Project({
                name,
                description,
                type,
                tags: tags || [],
                isPublic,
                ownerId: req.user._id,
                collaborators: [],
                version: '1.0.0',
                status: 'active'
            });

            await project.save();
            await project.populate('ownerId', 'name email avatar');

            res.status(201).json(project);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Update project
    static async updateProject(req, res) {
        try {
            const project = await Project.findById(req.params.id);
            
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // Check ownership
            if (!project.ownerId.equals(req.user._id)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const updates = req.body;
            Object.keys(updates).forEach(key => {
                project[key] = updates[key];
            });

            await project.save();
            await project.populate('ownerId', 'name email avatar');
            await project.populate('collaborators', 'name email avatar');

            res.json(project);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Delete project
    static async deleteProject(req, res) {
        try {
            const project = await Project.findById(req.params.id);
            
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // Check ownership
            if (!project.ownerId.equals(req.user._id)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Delete related files and commits
            await File.deleteMany({ projectId: project._id });
            await Commit.deleteMany({ projectId: project._id });
            await Project.findByIdAndDelete(project._id);

            res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Add collaborator
    static async addCollaborator(req, res) {
        try {
            const { userId } = req.body;
            const project = await Project.findById(req.params.id);
            
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // Check ownership
            if (!project.ownerId.equals(req.user._id)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if already a collaborator
            if (project.collaborators.includes(userId)) {
                return res.status(400).json({ message: 'User is already a collaborator' });
            }

            project.collaborators.push(userId);
            await project.save();
            await project.populate('collaborators', 'name email avatar');

            res.json(project);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Remove collaborator
    static async removeCollaborator(req, res) {
        try {
            const { userId } = req.params;
            const project = await Project.findById(req.params.id);
            
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // Check ownership
            if (!project.ownerId.equals(req.user._id)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            project.collaborators = project.collaborators.filter(
                collab => !collab.equals(userId)
            );
            
            await project.save();
            await project.populate('collaborators', 'name email avatar');

            res.json(project);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get project files
    static async getProjectFiles(req, res) {
        try {
            const files = await File.find({ projectId: req.params.id })
                .populate('authorId', 'name email')
                .sort({ createdAt: -1 });
            
            res.json(files);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Upload file
    static async uploadFile(req, res) {
        try {
            const { filename, path, content, fileType } = req.body;
            
            const file = new File({
                projectId: req.params.id,
                filename,
                path: path || '/',
                content,
                fileType,
                authorId: req.user._id,
                version: '1.0',
                size: content ? content.length : 0
            });

            await file.save();
            await file.populate('authorId', 'name email');

            res.status(201).json(file);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get specific file
    static async getFile(req, res) {
        try {
            const file = await File.findById(req.params.fileId)
                .populate('authorId', 'name email');
            
            if (!file) {
                return res.status(404).json({ message: 'File not found' });
            }

            res.json(file);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Update file
    static async updateFile(req, res) {
        try {
            const { content, version } = req.body;
            const file = await File.findById(req.params.fileId);
            
            if (!file) {
                return res.status(404).json({ message: 'File not found' });
            }

            file.content = content;
            file.version = version || file.version;
            file.size = content ? content.length : 0;
            file.authorId = req.user._id;

            await file.save();
            await file.populate('authorId', 'name email');

            res.json(file);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Delete file
    static async deleteFile(req, res) {
        try {
            const file = await File.findById(req.params.fileId);
            
            if (!file) {
                return res.status(404).json({ message: 'File not found' });
            }

            await File.findByIdAndDelete(req.params.fileId);
            res.json({ message: 'File deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get project commits
    static async getCommits(req, res) {
        try {
            const commits = await Commit.find({ projectId: req.params.id })
                .populate('authorId', 'name email avatar')
                .sort({ timestamp: -1 });
            
            res.json(commits);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Create commit (check-in)
    static async createCommit(req, res) {
        try {
            const { message, filesChanged, branch = 'main' } = req.body;
            
            const commit = new Commit({
                projectId: req.params.id,
                authorId: req.user._id,
                message,
                filesChanged: filesChanged || [],
                branch,
                hash: `commit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date()
            });

            await commit.save();
            await commit.populate('authorId', 'name email avatar');

            res.status(201).json(commit);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get specific commit
    static async getCommit(req, res) {
        try {
            const commit = await Commit.findById(req.params.commitId)
                .populate('authorId', 'name email avatar')
                .populate('filesChanged');
            
            if (!commit) {
                return res.status(404).json({ message: 'Commit not found' });
            }

            res.json(commit);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // Get project activity
    static async getProjectActivity(req, res) {
        try {
            const commits = await Commit.find({ projectId: req.params.id })
                .populate('authorId', 'name email avatar')
                .sort({ timestamp: -1 })
                .limit(50);
            
            res.json(commits);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = ProjectController;