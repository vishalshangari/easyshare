const defaultConfig = require("../config/default");
const testConfig = require("../config/test");

const firebaseAdmin = require("firebase-admin");

const servAcc = {
  projectId:
    process.env.NODE_ENV == "test"
      ? testConfig.project_id
      : defaultConfig.project_id,
  privateKey:
    process.env.NODE_ENV == "test"
      ? testConfig.private_key
      : process.env.NODE_ENV == "development"
      ? defaultConfig.private_key
      : JSON.parse(defaultConfig.private_key),
  clientEmail:
    process.env.NODE_ENV == "test"
      ? testConfig.client_email
      : defaultConfig.client_email,
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(servAcc),
});

module.exports = firebaseAdmin.firestore();
