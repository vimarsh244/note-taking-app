const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const { json } = require("express");

const app = express();
const port = 3000;
const DB_CONNECTION_STRING = dotenv.config().parsed.DB_CONNECTION_STRING;

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(json());

// Authentication middleware
function authenticate(req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const data = jwt.verify(token, 'SECRET_KEY');
    req.user = data;
    next();
  } catch {
    res.status(401).send({ message: 'Please authenticate' });
  }
}

// Define the Note schema
const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  noteID: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
});

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notes: [NoteSchema],
});

const User = mongoose.model("User", UserSchema);

// Connect to MongoDB
mongoose
  .connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"));

// Create a note
app.post("/api/notes", authenticate, async (req, res) => {
  const { title, content } = req.body;
  const note = { title, content };
  const user = await User.findById(req.user._id);
  user.notes.push(note);
  await user.save();
  const noteId = user.notes[user.notes.length - 1]._id;
  res.status(201).send({ ...note, _id: noteId });
});

// Get a specific note
app.get("/api/notes/:noteId",authenticate,  async (req, res) => {
  const user = await User.findById(req.user._id);
  const note = user.notes.id(req.params.noteId);
  if (note) {
    res.send(note);
  } else {
    res.status(404).send({ message: "Note not found" });
  }
});

// Update a note
app.put("/api/notes/:noteId",authenticate, async (req, res) => {
  const { title, content } = req.body;
  const user = await User.findById(req.user._id);
  const note = user.notes.id(req.params.noteId);
  if (note) {
    note.title = title;
    note.content = content;
    await user.save();
    res.send(note);
  } else {
    res.status(404).send({ message: "Note not found" });
  }
});

// Delete a note
app.delete("/api/notes/:noteId",authenticate, async (req, res) => {
  const user = await User.findById(req.user._id);
  const note = user.notes.id(req.params.noteId);
  if (note) {
    note.remove();
    await user.save();
    res.send({ message: "Note deleted successfully" });
  } else {
    res.status(404).send({ message: "Note not found" });
  }
});




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
