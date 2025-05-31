// backend/routes/auth.js
const express = require('express');
const router = express.Router();

// Placeholder for User model (in a real app, you'd import your User model)
// const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // In a real application, you would add more robust validation here
  // (e.g., check email format, password strength)

  try {
    // --- Database Logic Placeholder ---
    // 1. Check if user already exists (e.g., by email)
    //    const existingUser = await User.findOne({ email });
    //    if (existingUser) {
    //      return res.status(400).json({ msg: 'User already exists' });
    //    }

    // 2. Hash the password
    //    const hashedPassword = await hashPassword(password); // Assuming you have a hashPassword function

    // 3. Create a new user object
    //    const newUser = new User({
    //      username,
    //      email,
    //      password: hashedPassword,
    //    });

    // 4. Save the user to the database
    //    await newUser.save();
    // --- End Database Logic Placeholder ---

    // For now, returning a success message without database interaction
    console.log('Registration attempt:', { username, email });
    res.status(201).json({ msg: 'User registered successfully (placeholder)' });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server error during registration');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // --- Database Logic Placeholder ---
    // 1. Find the user by email
    //    const user = await User.findOne({ email });
    //    if (!user) {
    //      return res.status(400).json({ msg: 'Invalid credentials' });
    //    }

    // 2. Verify the password
    //    const isMatch = await comparePassword(password, user.password); // Assuming comparePassword function
    //    if (!isMatch) {
    //      return res.status(400).json({ msg: 'Invalid credentials' });
    //    }
    // --- End Database Logic Placeholder ---

    // --- JWT Generation Placeholder ---
    // If credentials are correct, generate a JWT
    // const payload = {
    //   user: {
    //     id: user.id, // Or whatever identifier you use
    //     // You can add more user details to the payload if needed
    //   },
    // };
    //
    // jwt.sign(
    //   payload,
    //   'yourJsonWebTokenSecret', // Use an environment variable for the secret in production
    //   { expiresIn: 3600 }, // Token expiration (e.g., 1 hour)
    //   (err, token) => {
    //     if (err) throw err;
    //     res.json({ token });
    //   }
    // );
    // --- End JWT Generation Placeholder ---

    console.log('Login attempt:', { email });
    // For now, returning a success message and a placeholder token
    res.json({
      msg: 'Login successful (placeholder)',
      token: 'sample_jwt_token',
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error during login');
  }
});

// @route   POST api/auth/logout
// @desc    Log user out (e.g., by clearing the token on the client-side)
// @access  Private (typically, but for this example, it's simple)
router.post('/logout', (req, res) => {
  // In a stateless JWT setup, logout is primarily handled on the client-side
  // by deleting the token.
  // Server-side might involve adding the token to a blacklist if using a more
  // complex session management strategy.
  console.log('Logout attempt');
  res.json({ msg: 'Logout successful (placeholder)' });
});

module.exports = router;
