
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

const cors = require('cors')
app.use(cors())

// Middleware for parsing JSON
app.use(express.json());


// user schema, nothing complex
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);


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
  noteID: { type: String, required: true, unique: true },
  userId: { type: String, ref: 'User', required: true},
});

const Note = mongoose.model('Note', noteSchema);

// Create a new note (not used)
app.post('/api/notes', authenticateToken, async (req, res) => {
  try {
    const { title, content, noteID } = req.body;

    const newNote = new Note({ title, content, noteID });
    await newNote.save();

    res.status(201).json({ message: 'Note created successfully' });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//update note (if not there iw ill also create note)
app.put('/api/notes/:noteID', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const noteID = req.params.noteID;
    const userID = req.user.id;

    console.log('Received noteID:', noteID);

    const filter = { noteID: noteID};
    const update = { title, content, userId: userID};
    const options = { new: true, upsert: true }; // upsert option for creating a new document if not found

    const updatedNote = await Note.findOneAndUpdate(filter, update, options);

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//deleting note
app.delete('/api/notes/:noteID', authenticateToken, async (req, res) => {
  try {
    const noteID = req.params.noteID;

    const deletedNote = await Note.findOneAndDelete({ noteID: noteID });

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Fetch all notes of a user
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const notes = await Note.find({ userId });

    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Search for content in notes belonging to a particular user
app.get('/api/notes/search', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const searchQuery = req.query.q;

    const notes = await Note.find({ userId, content: { $regex: searchQuery, $options: 'i' } });

    res.status(200).json(notes);
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
