const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', ProjectController.getAllProjects); // Get all public projects
router.get('/:id', ProjectController.getProject); // Get project details

// Protected routes
router.post('/', auth, ProjectController.createProject); // Create new project
router.put('/:id', auth, ProjectController.updateProject); // Update project
router.delete('/:id', auth, ProjectController.deleteProject); // Delete project
router.post('/:id/collaborators', auth, ProjectController.addCollaborator); // Add collaborator
router.delete('/:id/collaborators/:userId', auth, ProjectController.removeCollaborator); // Remove collaborator

// File routes
router.get('/:id/files', ProjectController.getProjectFiles); // Get project files
router.post('/:id/files', auth, ProjectController.uploadFile); // Upload file
router.get('/:id/files/:fileId', ProjectController.getFile); // Get specific file
router.put('/:id/files/:fileId', auth, ProjectController.updateFile); // Update file
router.delete('/:id/files/:fileId', auth, ProjectController.deleteFile); // Delete file

// Commit routes
router.get('/:id/commits', ProjectController.getCommits); // Get project commits
router.post('/:id/commits', auth, ProjectController.createCommit); // Create commit (check-in)
router.get('/:id/commits/:commitId', ProjectController.getCommit); // Get specific commit

// Activity routes
router.get('/:id/activity', ProjectController.getProjectActivity); // Get project activity

module.exports = router;