const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    }
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

////////////////////////////////////////////////////////////
const projectsSchema = new mongoose.Schema(
    {
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  type: String, // "Web App", "Mobile App", "Literature", etc.
  version: String,
  ownerId: mongoose.Schema.Types.ObjectId, // reference to users collection
  collaborators: [mongoose.Schema.Types.ObjectId], // references to users collection
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date,
  tags: [String],
  status: String // "active", "archived", "completed"
}
)

const Project = mongoose.model('Project', projectsSchema);

const filesSchema = new mongoose.Schema(
    {
  _id: mongoose.Schema.Types.ObjectId,
  projectId: mongoose.Schema.Types.ObjectId, // reference to projects collection
  filename: String,
  path: String,
  content: String, // or GridFS reference for large files
  version: String,
  authorId: mongoose.Schema.Types.ObjectId, // reference to users collection
  commitId: mongoose.Schema.Types.ObjectId, // reference to commits collection
  createdAt: Date,
  size: Number,
  fileType: String
}
)

const File = mongoose.model('File', filesSchema);

const commitsSchema = new mongoose.Schema(
    {
  _id: mongoose.Schema.Types.ObjectId,
  projectId: mongoose.Schema.Types.ObjectId, // reference to projects collection
  authorId: mongoose.Schema.Types.ObjectId, // reference to users collection
  message: String,
  timestamp: Date,
  filesChanged: [mongoose.Schema.Types.ObjectId], // references to files collection
  parentCommit: mongoose.Schema.Types.ObjectId, // reference to previous commit
  branch: String,
  hash: String // unique commit identifier
}
)

const Commit = mongoose.model('Commit', commitsSchema);

const messagesSchema = new mongoose.Schema(
    {
  _id: mongoose.Schema.Types.ObjectId,
  projectId: mongoose.Schema.Types.ObjectId, // reference to projects collection
  userId: mongoose.Schema.Types.ObjectId, // reference to users collection
  message: String,
  type: String, // "commit", "comment", "system", "chat"
  timestamp: Date,
  metadata: {
    commitId: mongoose.Schema.Types.ObjectId, // if type is "commit"
    fileId: mongoose.Schema.Types.ObjectId // if related to specific file
  }
}
)

const Message = mongoose.model('Message', messagesSchema);

const branchesSchema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        projectId: mongoose.Schema.Types.ObjectId, // reference to projects collection
        name: String,
        createdBy: mongoose.Schema.Types.ObjectId, // reference to users collection
        createdAt: Date,
        isDefault: Boolean,
        lastCommit: mongoose.Schema.Types.ObjectId, // reference to commits collection
        status: String // "active", "merged", "deleted"
    });

const Branch = mongoose.model('Branch', branchesSchema);

const FriendshipsSchema = new mongoose.Schema(
    {
  _id: mongoose.Schema.Types.ObjectId,
  requesterId: mongoose.Schema.Types.ObjectId, // reference to users collection
  addresseeId: mongoose.Schema.Types.ObjectId, // reference to users collection
  status: String, // "pending", "accepted", "blocked"
}, 
{
    timestamps : true
}
)

const Friendship = mongoose.model('Friendship', FriendshipsSchema);

module.exports ={
    User,
    Project,
    File,
    Commit,
    Message,
    Branch,
    Friendship
}