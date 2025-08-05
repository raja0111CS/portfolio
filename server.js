const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB error:', err);
});

// ====== MODELS ======
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

const contactMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstname: { type: String, required: true, minlength: 2, maxlength: 30 },
  lastname: { type: String, required: true, minlength: 2, maxlength: 30 },
  email: { type: String, required: true, minlength: 5, maxlength: 50 },
  contactNo: { type: String, required: true, minlength: 10, maxlength: 15 },
  message: { type: String, required: true, minlength: 10, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now }
});
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// ====== HELPERS ======
const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = pass => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(pass);

// ====== MIDDLEWARE ======
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decoded.userId;
    next();
  });
};

// ====== ROUTES ======

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || username.length < 3) return res.status(400).json({ message: 'Username must be at least 3 characters' });
  if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email' });
  if (!validatePassword(password)) return res.status(400).json({ message: 'Password must be 8–16 characters, with letters and numbers' });

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashed });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000,
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Forgot Password
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:${PORT}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.`,
    });

    res.json({ message: 'Password reset link sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reset link', error: err.message });
  }
});

// Dashboard
app.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: `Welcome, ${user.username}`, user });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard error', error: err.message });
  }
});

// Contact form (profile.html)
app.post('/contact', verifyToken, async (req, res) => {
  const { firstname, lastname, email, contactNo, message } = req.body;

  if (!firstname || !lastname || !email || !contactNo || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const contact = new ContactMessage({
      user: req.userId,
      firstname,
      lastname,
      email,
      contactNo,
      message
    });

    await contact.save();
    res.status(201).json({ message: 'Message submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Message failed', error: err.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
