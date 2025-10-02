const mongoose = require('mongoose');

const dummyUser = {
  _id: new mongoose.Types.ObjectId(),
  name: "Carlos Juma",
  email: "carlos.juma@example.com",
  password: "$2b$12$LQv3c1yqBwlFDL7bBFl9xuBUb9Y1c1c1c1c1c1c1c1c1c1c1c1c1c", // hashed password for "password123"
  bio: "Full-stack developer passionate about version control systems and collaborative development. Currently studying at the University of Pretoria.",
  avatar: "/assets/images/carlos-avatar.png",
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-12-15T14:22:00Z'),
  friends: [
    new mongoose.Types.ObjectId(), // John McGinn's ID
    new mongoose.Types.ObjectId(), // Alex Hunter's ID
    new mongoose.Types.ObjectId()  // Jane Doe's ID
  ],
  settings: {
    notifications: true,
    privacy: "public"
  }
};

// If you want to create this user in your database:
const createDummyUser = async () => {
  try {
    const { User } = require('./models/models');
    
    // Note: Don't include the hashed password when creating via schema
    // Let the pre-save middleware handle the hashing
    const userToCreate = {
      _id: new mongoose.Types.ObjectId(),
      name: "Carlos Juma",
      email: "carlos.juma@example.com",
      password: "password123", 
      bio: "Full-stack developer passionate about version control systems and collaborative development.",
      avatar: "/assets/images/carlos-avatar.png",
      createdAt: new Date(),
      updatedAt: new Date(),
      friends: [],
      settings: {
        notifications: true,
        privacy: "public"
      }
    };
    
    const user = new User(userToCreate);
    await user.save();
    console.log('Dummy user created:', user);
    return user;
  } catch (error) {
    console.error('Error creating dummy user:', error);
  }
};

createDummyUser();