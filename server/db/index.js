const firebaseAdmin = require("firebase-admin");

const servAcc = {
  projectId: "easyshare-f66a0",
  privateKey:
    process.env.NODE_ENV == "development"
      ? process.env.FIREBASE_PRIVATE_KEY
      : JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
  clientEmail:
    "firebase-adminsdk-olsez@easyshare-f66a0.iam.gserviceaccount.com",
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(servAcc),
});

module.exports = firebaseAdmin.firestore();
