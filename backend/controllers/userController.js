const db = require("../models/db");
const jwt = require('jsonwebtoken');

// Function to generate JWT token for a user
const generateToken = (user) => {
  const payload = {
    id: user.id, 
    name: user.name,
  };

  // Sign the token with a secret key
  const token = jwt.sign(payload,"dsdfdfdffs", { expiresIn: '1h' });

  return token;
};

const loginUser = (req, res) => {
  const { userId, password } = req.body;
  console.log(userId, password)
  if (!userId || !password) {
    return res.status(400).json({ message: 'User ID and Password are required.' });
  }

  // Use PostgreSQL-style parameterized query with $1 for userId
  const query = 'SELECT * FROM users WHERE user_id = $1';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database query failed: ', err);
      return res.status(500).json({ error: 'Database query failed.' });
    }
    console.log(results)
    if (!results.rows || results.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid User ID or Password.' });
    }

    const user = results.rows[0]; 

    // Compare plain-text passwords (insecure, for demo purposes only)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid User ID or Password.' });
    }

    // Generate JWT token after successful password match
    const token = generateToken(user);

    // Send the token along with the user's name
    return res.json({ token, name: user.name });
  });
};

module.exports = { loginUser };
