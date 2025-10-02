const { User, Project } = require('../models/models');
const jwt = require('jsonwebtoken');

class UserController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            console.log(name);
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const user = new User({ name, email, password });
            await user.save();

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.params.id)
                .select('-password')
                .populate('friends', 'name email avatar');
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async searchUsers(req, res) {
        try {
            const { query } = req.query;
            const users = await User.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            }).select('name email avatar').limit(10);

            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async updateProfile(req, res) {
        try {
            const { name, bio, settings } = req.body;
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { name, bio, settings },
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async deleteAccount(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const projects = await Project.find({ ownerId: req.params.id });
            for (const project of projects) {
                if(project.collaborators.length <= 1){
                    await Project.findByIdAndDelete(project._id);
                }
            }

            
            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = UserController;