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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

////////////////////////////////////////////////////////////
const projectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    required: true
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectsSchema);

const filesSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    default: '/'
  },
  content: {
    type: String,
    default: ''
  },
  version: {
    type: String,
    default: '1.0'
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  commitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commit'
  },
  size: {
    type: Number,
    default: 0
  },
  fileType: {
    type: String,
    default: 'text'
  }
}, {
  timestamps: true
});

const File = mongoose.model('File', filesSchema);

const commitsSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  filesChanged: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  parentCommit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commit'
  },
  branch: {
    type: String,
    default: 'main'
  },
  hash: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
});

const Commit = mongoose.model('Commit', commitsSchema);

const messagesSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['commit', 'comment', 'system', 'chat'],
    default: 'comment'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    commitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Commit'
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    }
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messagesSchema);

const branchesSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  lastCommit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commit'
  },
  status: {
    type: String,
    enum: ['active', 'merged', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Branch = mongoose.model('Branch', branchesSchema);

const FriendshipsSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addresseeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending'
  }
}, {
  timestamps: true
});

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