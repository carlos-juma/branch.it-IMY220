const mongoose = require('mongoose');

async function run (){mongoose.connect(process.env.MONGO_URI || "mongodb+srv://u22602047:eAq1ChbA1nblS1NY@branchit.ugzr4l4.mongodb.net/branchITdb?retryWrites=true&w=majority&appName=branchIT",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = new mongoose.Schema(
    {
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String, // unique
  password: String, // hashed
  bio: String,
  avatar: String, // URL or file path
  createdAt: Date,
  updatedAt: Date,
  friends: [mongoose.Schema.Types.ObjectId], // references to other users
  settings: {
    notifications: Boolean,
    privacy: String
  }
}
)

const User = mongoose.model('User', userSchema);


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
  createdAt: Date,
  updatedAt: Date
}
)

const Friendship = mongoose.model('Friendship', FriendshipsSchema);

}

run().catch(err => console.log(err));


