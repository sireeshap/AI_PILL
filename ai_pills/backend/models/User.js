// backend/models/User.js

// This is a placeholder for the User schema.
// In a real application, you would use an ORM like Mongoose (for MongoDB)
// or Sequelize (for SQL databases) to define and interact with your database.

const User = {
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // Add email validation (e.g., using a regex or a library like validator.js)
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Example minimum password length
  },
  // Timestamps for when the user was created and updated
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};

// Placeholder for password hashing function (e.g., using bcryptjs)
// async function hashPassword(password) {
//   // Generate a salt
//   // Hash the password with the salt
//   // Return the hashed password
// }

// Placeholder for a method to compare passwords
// async function comparePassword(candidatePassword, hashedPassword) {
//   // Compare the candidate password with the hashed password
//   // Return true if they match, false otherwise
// }

// Placeholder for saving a new user to the database
// async function saveUser(userData) {
//   // Hash the password before saving
//   // Create a new user instance with the userData
//   // Save the user to the database
//   // Return the saved user object (without the password)
// }

// Placeholder for finding a user by email
// async function findUserByEmail(email) {
//   // Find a user in the database by their email address
//   // Return the user object if found, null otherwise
// }

module.exports = User; // In a real app, you'd export the Mongoose/Sequelize model
