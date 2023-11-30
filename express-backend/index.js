
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const dotenv = require('dotenv');
DB_CONNECTION_STRING= dotenv.config().parsed.DB_CONNECTION_STRING;

console.log(DB_CONNECTION_STRING);



// Connect to MongoDB
mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB:', error));

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const cors = require('cors')
app.use(cors())

// Middleware for parsing JSON
app.use(express.json());

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secretKey');

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  jwt.verify(token, 'secretKey', (error, user) => {
    if (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

// Define Note schema
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Note = mongoose.model('Note', noteSchema);

// Create a new note
app.post('/api/notes', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId;

    const newNote = new Note({ title, content, userId });
    await newNote.save();

    res.status(201).json({ message: 'Note created successfully' });
  } catch (error) {
    console.error('Error during note creation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all notes for a user
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const notes = await Note.find({ userId });
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error during fetching notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a note
app.put('/api/notes/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const noteId = req.params.id;
    const userId = req.user.userId;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { title, content, lastUpdated: Date.now() },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error during note update:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a note
app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;

    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error during note deletion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
