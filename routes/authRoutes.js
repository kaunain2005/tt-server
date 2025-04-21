const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { admin, db } = require('../config/firebase');  // Include db for Firestore

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password)
    return res.status(400).json({ message: 'Email & password required' });

  try {
    // 1) Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({ email, password });
    const uid = userRecord.uid;

    // 2) Create a corresponding Firestore document
    await db.collection('users').doc(uid).set({
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 3) Issue backend JWT
    const token = jwt.sign({ uid }, process.env.JWT_SECRET, {
      expiresIn: '1h'  // The token will expire in 1 hour
    });

    // Send response with user info and token
    res.status(201).json({
      uid,
      email,
      jwtToken: token
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { firebaseToken } = req.body;
  
    if (!firebaseToken) return res.status(400).json({ message: 'Token required' });
  
    try {
      // 1) Verify Firebase ID Token
      const decoded = await admin.auth().verifyIdToken(firebaseToken);
      const uid = decoded.uid;
  
      // 2) Issue backend JWT
      const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // 3) Send response with JWT
      res.json({ jwtToken: token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(401).json({ message: 'Invalid Firebase token' });
    }
  });
  
module.exports = router;
