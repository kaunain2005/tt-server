const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount/serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://task-tracker-9c098.firebaseio.com"
});

const db   = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
