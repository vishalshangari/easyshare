const firebaseAdmin = require("firebase-admin");

const servAcc = {
  projectId:
    process.env.NODE_ENV == "test"
      ? process.env.TEST_FIREBASE_PROJECT_ID
      : process.env.FIREBASE_PROJECT_ID,
  privateKey:
    process.env.NODE_ENV == "test"
      ? process.env.TEST_FIREBASE_PRIVATE_KEY
      : process.env.NODE_ENV == "development"
      ? process.env.FIREBASE_PRIVATE_KEY
      : JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
  clientEmail:
    process.env.NODE_ENV == "test"
      ? process.env.TEST_FIREBASE_CLIENT_EMAIL
      : process.env.FIREBASE_CLIENT_EMAIL,
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(servAcc),
});

module.exports = firebaseAdmin.firestore();
